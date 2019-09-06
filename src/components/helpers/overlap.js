import {converDateToMS} from './timeFormat'
function checkOverlap(array, taskObj){
    const feedbackMsg = []
    const findOverlap = array.filter(task=>{
        for(let dayInCurrentTask of task.days){
            for(let dayInNewTask of taskObj.days){
                if(dayInNewTask.day === dayInCurrentTask.day){
                    const beginCurrentTask = converDateToMS(dayInCurrentTask.begin)
                    const endCurrentTask = converDateToMS(dayInCurrentTask.end)
                    const beginNewTask = converDateToMS(dayInNewTask.begin)
                    const endNewTask = converDateToMS(dayInNewTask.end)
                    if(
                        beginNewTask >= beginCurrentTask && 
                        endNewTask <= endCurrentTask   
                    ){
                        feedbackMsg.push(feedbackMsg('overlap', dayInCurrentTask))
                        return task
                    }
                    else if(
                        beginNewTask >= beginCurrentTask && 
                        endNewTask >= endCurrentTask     &&
                        beginNewTask < endCurrentTask   
                    ){
                        feedbackMsg.push(feedbackMsg('begins', dayInCurrentTask))
                        return task
                    }
                    else if(
                        beginNewTask <= beginCurrentTask &&
                        endNewTask <= endCurrentTask     &&
                        endNewTask > beginCurrentTask
                    ){
                        feedbackMsg.push(feedbackMsg('ends', dayInCurrentTask))
                        return task
                    }
                    else if(
                        beginNewTask < beginCurrentTask &&
                        endNewTask > endCurrentTask     
                    ){
                        feedbackMsg.push(feedbackMsg('long', dayInCurrentTask))
                        return task
                    }
                }
            }
        }
    })

    return {
        findOverlap,
        feedbackMsg
    }
}

function feedbackMsg(offense, currentTask){
    if(offense === 'overlaps'){
        return `
            <p>
                This task overlaps with the task <span>${currentTask.task}</span> from <span>${currentTask.begin} - ${currentTask.end}</span> on a <span>${currentTask.day}</span>
            </p>
        `
    }
    else if (offense === 'begins'){
        return `
            <p>
                This task begins within the task <span>${currentTask.task}</span> from <span>${currentTask.begin} - ${currentTask.end}</span> on a <span>${currentTask.day}</span>
            </p>
        `
    }
    else if (offense === 'ends'){
        return `
            <p>
                This task ends within the task <span>${currentTask.task}</span> from <span>${currentTask.begin} - ${currentTask.end}</span> on a <span>${currentTask.day}</span>
            </p>
        `
    }
    else if (offense === 'long'){
        return `
            <p>
                This task is to long therfore it is within the task <span> ${currentTask.task} <span/> from <span> ${currentTask.begin} - ${currentTask.end} </span> on a <span>${currentTask.day}</span>
            </p>
        `
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

export {checkOverlap, addDayToMsg, feedbackMsg}