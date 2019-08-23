function checkConnectedLi(task){
    const connectedLi = []
    document.querySelectorAll('#Timeline li').forEach(li=>{
        const taskHeight = task.offsetHeight
        const taskOffsetTop = task.offsetTop
        const taskMaxpoint = taskHeight+taskOffsetTop
        const quarterInPx = li.offsetHeight/2 // Because one li represents half an hour

        const min = taskOffsetTop - (quarterInPx*1.2) 
        const max = taskMaxpoint  + (quarterInPx*1.2)  

        const liMin = li.offsetTop
        const liMax = li.offsetTop + li.offsetHeight
        li.classList.remove('opacity')
        if(liMin >= min && liMax <= max){
            connectedLi.push(li)
        }
      })
    return connectedLi
}

export {checkConnectedLi}