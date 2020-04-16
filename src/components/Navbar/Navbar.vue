<template>
  <div id="NavBar">
    <div class="left-panel">
      <div @click="toggle" class="open-side-menu">
        <i class="fas fa-bars"></i>
      </div>
      <Temperature :weatherData="weatherData" />
    </div>
    <CurrentTime :currentTask="currentTask" />
    <div class="right-panel">
      <Auth />
    </div>
  </div>
</template>

<script>
import Temperature from "@/components/Navbar/parts/Temperature";
import Auth from "@/components/Navbar/parts/Auth";
import CurrentTime from "@/components/Navbar/parts/CurrentTime";
export default {
  name: "NavBar",
  props: ["weatherData", "currentTask"],
  components: {
    Temperature,
    Auth,
    CurrentTime
  },
  methods: {
    toggle() {
      const colorLabels = document.querySelector("#Color-Label");
      if (colorLabels) {
        if (colorLabels.style.left !== "") {
          setTimeout(() => {
            colorLabels.style.removeProperty("left");
          }, 500);
        }
      }
      this.$emit("toggle");
    }
  },
  mounted() {
    // To be sure that the navbar loads first in order to render the view
    setTimeout(() => {
      this.$emit("navbarLoaded");
    }, 50);
  }
};
</script>

<style>
#NavBar {
  display: flex;
  justify-content: center;
  background: white;
  border-bottom: 1px rgba(0, 0, 0, 0.4) solid;
  z-index: 1000;
  padding: 5px 8px;
  position: relative;
}
#NavBar .left-panel {
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
}
#NavBar .right-panel {
  position: absolute;
  right: 0;
}
#NavBar .open-side-menu {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 30px;
  transition: 0.25s;
  cursor: pointer;
}
#NavBar .open-side-menu:hover {
  background: rgba(0, 0, 0, 0.4);
}
#NavBar .open-side-menu:hover i {
  color: white;
}
</style>