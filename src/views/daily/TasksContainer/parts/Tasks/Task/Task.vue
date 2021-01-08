<template>
   <div
      class="task"
      :class="{
         expanded: expanded === task,
         opacity: checkVisibleTask || checkPopup,
      }"
      :data-begin="getTimeOfThisDay('begin', task)"
      :data-end="getTimeOfThisDay('end', task)"
      :style="taskProps"
      @click="clickOnTask"
      @contextmenu="openTab(task)"
      @transitionend="animEnded"
   >
      <app-popup
         v-if="popupSettings"
         :settings="popupSettings"
         :componentId="'CustomContext'"
         v-on:turnOffPopup="turnOffPopup"
      />
      <task-more
         :task="task"
         :edit="edit"
         :today="today"
         v-if="expanded === task"
         v-on:contractTask="contractTask"
      />
      <div class="info" v-else>
         <p class="task-name" v-if="edit !== task">
            {{ task.task }}
         </p>
         <div class="time">
            <p class="task-begin" v-if="edit !== task">
               {{ getTimeOfThisDay("begin", task) }}-
            </p>
            <p class="task-end" v-if="edit !== task">
               {{ getTimeOfThisDay("end", task) }}
            </p>
         </div>
      </div>
   </div>
</template>

<script>
import TaskMore from "./More/TaskMore";
import { checkConnectedLi } from "@/components/helpers/timeline";
import Popup from "@/components/Popup/Popup";

export default {
   name: "Task",
   components: {
      "task-more": TaskMore,
      "app-popup": Popup,
   },
   props: [
      "task",
      "edit",
      "expanded",
      "today",
      "diffrence",
      "compareTop",
      "visibleTask",
   ],
   data() {
      return {
         taskHeightWhenExpanded: 250,
         top: null,
         height: null,
         timelinePos: [],
         popupSettings: null,
      };
   },
   methods: {
      turnOffPopup() {
         // There has to be a timeout here otherwise it will trigger the click on task event
         setTimeout(() => {
            this.popupSettings = null;
         }, 1);
      },
      openTab() {
         event.preventDefault();
         if (event.target.classList.length > 0) {
            if (event.target.classList[0] === "popup-disabler") {
               return;
            }
         }
         this.popupSettings = {
            type: "task",
            data: this.task,
            coords: {
               x: event.x,
               y: event.y,
            },
         };
      },
      emitToParent(method) {
         this.$emit(method);
      },
      contractTask() {
         this.resetTimeline();
         this.$emit("expandTask");
      },
      getTimeOfThisDay(state, task) {
         return task.days.find((day) => day.day === this.today)[state];
      },
      animEnded() {
         if (this.expanded === this.task) {
            const container = document.querySelector("#planner");
            const scrollToY =
               this.$el.offsetTop -
               container.offsetHeight / 2 +
               this.$el.offsetHeight / 2;
            container.scrollTo(0, scrollToY);
         } else {
            this.$emit("emitToParent", "checkActiveTask");
         }
      },
      clickOnTask() {
         if (this.popupSettings || this.$el.querySelector(".popup-container")) {
            return;
         }
         if (
            this.expanded === this.task ||
            event.target.classList.contains("task-nav-item")
         ) {
            // If the user clicks cancel this will be triggerd
            return;
         }
         if (this.expanded === null) {
            this.expandTask();
         } else {
            this.resetTimeline();
            this.expandTask();
         }
      },
      resetTimeline() {
         document.querySelectorAll("#Timeline li").forEach((li) => {
            li.style.removeProperty("margin-bottom");
            li.style.removeProperty("margin-top");
         });
      },
      expandTask() {
         if (this.$el.offsetHeight < this.taskHeightWhenExpanded) {
            const diffrence = this.taskHeightWhenExpanded - this.heightVal();
            this.adjustTimeline(this.$el, diffrence);
            this.$emit("expandTask", {
               task: this.task,
               compareTop: this.topVal(),
               diffrence: diffrence,
            });
         } else {
            this.$emit("expandTask", {
               task: this.task,
               compareTop: null,
               diffrence: null,
            });
         }
      },
      adjustTimeline(el, diffrence) {
         const connectedLi = checkConnectedLi(el);
         const adjustLi = connectedLi[connectedLi.length - 1];
         const bottomOfsetTask = el.offsetTop + el.offsetHeight;
         const bottomOfLi = adjustLi.offsetTop + adjustLi.offsetHeight;
         if (bottomOfsetTask >= bottomOfLi) {
            adjustLi.style.marginBottom = `${diffrence}px`;
         } else {
            adjustLi.style.marginTop = `${diffrence}px`;
         }
      },
      topVal() {
         return this.calculatePoint(
            this.task.days.find((day) => day.day === this.today).begin
         );
      },
      heightVal() {
         return (
            this.calculatePoint(
               this.task.days.find((day) => day.day === this.today).end
            ) - this.topVal()
         );
      },
      calculatePoint(state) {
         if (this.timelinePos.length > 0) {
            const li = this.timelinePos.find((li) => {
               const liHour = li.time.split(":")[0];
               const taskHour = state.split(":")[0];
               if (liHour === taskHour) {
                  return li;
               }
            });
            const calcMinutes = ((li.height * 2) / 60) * state.split(":")[1];
            const point = li.midpoint + calcMinutes;
            return point;
         }
      },
   },
   computed: {
      taskProps() {
         if (!this.expanded) {
            return {
               top: this.topVal() + "px",
               height: this.heightVal() + "px",
               background: this.task.color.color,
            };
         } else if (this.expanded === this.task) {
            if (this.$el.offsetHeight < this.taskHeightWhenExpanded) {
               return {
                  top: this.topVal() + "px",
                  height: this.taskHeightWhenExpanded + "px",
                  background: this.task.color.color,
               };
            } else {
               return {
                  top: this.topVal() + "px",
                  height: this.heightVal + "px",
                  background: this.task.color.color,
               };
            }
         } else if (this.expanded !== this.task) {
            if (this.compareTop === null) {
               return {
                  top: this.topVal() + "px",
                  height: this.heightVal() + "px",
                  background: this.task.color.color,
               };
            }
            if (this.topVal() > this.compareTop) {
               return {
                  top: this.topVal() + this.diffrence + "px",
                  height: this.heightVal() + "px",
                  background: this.task.color.color,
               };
            } else {
               return {
                  top: this.topVal() + "px",
                  height: this.heightVal() + "px",
                  background: this.task.color.color,
               };
            }
         }
         return null;
      },
      checkPopup() {
         if (this.popupSettings) {
            if (this.popupSettings.data === this.task) {
               return true;
            } else {
               return false;
            }
         } else {
            return false;
         }
      },
      checkVisibleTask() {
         if (this.$el === this.visibleTask) {
            return true;
         } else {
            return false;
         }
      },
   },
   mounted() {
      this.timelinePos = Array.from(
         document.querySelectorAll("#Timeline li")
      ).map((li) => {
         return {
            time: li.dataset.time,
            height: li.offsetHeight,
            midpoint: li.offsetTop + li.offsetHeight / 2,
         };
      });
   },
};
</script>

<style scoped>
.task {
   position: absolute;
   width: 90%;
   display: flex;
   flex-direction: column;
   transition: 0.5s ease-out;
   background: orange;
   color: white;
   border-radius: 6px;
   opacity: 0.15;
   overflow: hidden;
   user-select: none;
   /* padding: 2px 5px; */
}

.task.opacity {
   opacity: 1;
}
.task.activeByEdit {
   opacity: 1;
}

.task .task-name {
   max-width: 90%;
}
.task .time {
   display: flex;
   font-size: 0.7em;
}
.task.expanded {
   height: 250px;
   opacity: 1;
}
.task .info {
   pointer-events: none;
   padding: 2px 5px;
}
</style>