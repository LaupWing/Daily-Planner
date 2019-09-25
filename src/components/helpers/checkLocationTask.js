
export default function checkLocationTask(){
    const scrolled = document.querySelector('#planner').scrollTop
    const height = document.querySelector('#planner').offsetHeight
    const midpoint = scrolled + (height/2)
    if(document.querySelectorAll('.task')===undefined) return
    const tasks = Array.from(document.querySelectorAll('.task'))
    const findTask = tasks.find(task=>{
        const taskHeight = task.offsetHeight
        const taskOffsetTop = task.offsetTop
        const taskMaxpoint = taskHeight+taskOffsetTop
        if(midpoint >= taskOffsetTop && midpoint <= taskMaxpoint){
            return task
        }
    })
    return findTask
}