import {converDateToMS} from './timeFormat'
function checkOverlap(array, taskObj){
    let feedbackMsg = null
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
                        feedbackMsg = `This task overlaps with the task ${task.task} from ${dayInCurrentTask.begin} - ${dayInCurrentTask.end}`
                        return task
                    }
                    else if(
                        beginNewTask >= beginCurrentTask && 
                        endNewTask >= endCurrentTask     &&
                        beginNewTask < endCurrentTask   
                    ){
                        feedbackMsg = `This task begins within the task ${task.task} from ${dayInCurrentTask.begin} - ${dayInCurrentTask.end}`
                        return task
                    }
                    else if(
                        beginNewTask <= beginCurrentTask &&
                        endNewTask <= endCurrentTask     &&
                        endNewTask > beginCurrentTask
                    ){
                        feedbackMsg = `This task ends within the task ${task.task} from ${dayInCurrentTask.begin} - ${dayInCurrentTask.end}`
                        return task
                    }
                    else if(
                        beginNewTask < beginCurrentTask &&
                        endNewTask > endCurrentTask     
                    ){
                        feedbackMsg = `This task is to long therfore it is within the task ${task.task} from ${dayInCurrentTask.begin} - ${dayInCurrentTask.end}`
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

function addDayToMsg(overlapArray, feedbackMsg, taskObj){
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