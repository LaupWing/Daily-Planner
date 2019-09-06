import {converDateToMS} from './timeFormat'
function checkOverlap(array, taskObj){
    const feedback = []
    array.forEach(task=>{
        for(let dayInCurrentTask of task.days){
            for(let dayInNewTask of taskObj.days){
                if(dayInNewTask.day === dayInCurrentTask.day){
                    console.log(dayInNewTask.day , dayInCurrentTask.day)
                    const beginCurrentTask = converDateToMS(dayInCurrentTask.begin)
                    const endCurrentTask = converDateToMS(dayInCurrentTask.end)
                    const beginNewTask = converDateToMS(dayInNewTask.begin)
                    const endNewTask = converDateToMS(dayInNewTask.end)
                    if(
                        beginNewTask >= beginCurrentTask && 
                        endNewTask <= endCurrentTask   
                    ){
                        feedback.push(feedbackMsg('overlaps', task, dayInCurrentTask))
                    }
                    else if(
                        beginNewTask >= beginCurrentTask && 
                        endNewTask >= endCurrentTask     &&
                        beginNewTask < endCurrentTask   
                    ){
                        feedback.push(feedbackMsg('begins', task, dayInCurrentTask))
                    }
                    else if(
                        beginNewTask <= beginCurrentTask &&
                        endNewTask <= endCurrentTask     &&
                        endNewTask > beginCurrentTask
                    ){
                        feedback.push(feedbackMsg('ends', task, dayInCurrentTask))
                    }
                    else if(
                        beginNewTask < beginCurrentTask &&
                        endNewTask > endCurrentTask     
                    ){
                        feedback.push(feedbackMsg('long', task, dayInCurrentTask))
                    }
                }
            }
        }
    })
    const findOverlap = null
    return {
        findOverlap,
        feedback
    }
}

function feedbackMsg(offense,task, dayInCurrentTask){
    if(offense === 'overlaps'){
        return `
            <p>
                This task overlaps with the task <span>${task.task}</span> from <span>${dayInCurrentTask.begin} - ${dayInCurrentTask.end}</span> on a <span>${dayInCurrentTask.day}</span>
            </p>
        `.replace(/\s+/g, " ").trim()
    }
    else if (offense === 'begins'){
        return `
            <p>
                This task begins within the task <span>${task.task}</span> from <span>${dayInCurrentTask.begin} - ${dayInCurrentTask.end}</span> on a <span>${dayInCurrentTask.day}</span>
            </p>
        `.replace(/\s+/g, " ").trim()
    }
    else if (offense === 'ends'){
        return `
            <p>
                This task ends within the task <span>${task.task}</span> from <span>${dayInCurrentTask.begin} - ${dayInCurrentTask.end}</span> on a <span>${dayInCurrentTask.day}</span>
            </p>
        `.replace(/\s+/g, " ").trim()
    }
    else if (offense === 'long'){
        return `
            <p>
                This task is to long therfore it is within the task <span> ${task.task} <span/> from <span> ${dayInCurrentTask.begin} - ${dayInCurrentTask.end} </span> on a <span>${dayInCurrentTask.day}</span>
            </p>
        `.replace(/\s+/g, " ").trim()
    }
}


function addDayToMsg(overlapArray, feedbackMsg, taskObj){
    console.log(overlapArray, taskObj, feedbackMsg)
    const feedback = []
    overlapArray.forEach(task=>{
        const overlappingDays = task.days.filter(day=>{
            if(taskObj.days.includes(day)){
                return day
            }
        })
        overlappingDays.forEach(day=>{
            feedback.push(`${feedbackMsg} on a ${day}`)
        })
    })
    return feedback
}

export {checkOverlap, addDayToMsg}