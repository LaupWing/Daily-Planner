import {converDateToMS} from './timeFormat'
function checkOverlap(array, taskObj){
    let feedbackMsg = null
    const findOverlap = array.filter(task=>{
        for(let dayInCurrentTask of task.days){
            for(let dayInNewTask of taskObj.days){
                if(dayInNewTask === dayInCurrentTask){
                    const beginCurrentTask = converDateToMS(task.begin)
                    const endCurrentTask = converDateToMS(task.end)
                    const beginNewTask = converDateToMS(taskObj.begin)
                    const endNewTask = converDateToMS(taskObj.end)
                    if(
                        beginNewTask >= beginCurrentTask && 
                        endNewTask <= endCurrentTask   
                    ){
                        feedbackMsg = `This task overlaps with the task ${task.task} from ${task.begin} - ${task.end}`
                        return task
                    }
                    else if(
                        beginNewTask >= beginCurrentTask && 
                        endNewTask >= endCurrentTask     &&
                        beginNewTask < endCurrentTask   
                    ){
                        feedbackMsg = `This task begins within the task ${task.task} from ${task.begin} - ${task.end}`
                        return task
                    }
                    else if(
                        beginNewTask <= beginCurrentTask &&
                        endNewTask <= endCurrentTask     &&
                        endNewTask > beginCurrentTask
                    ){
                        feedbackMsg = `This task ends within the task ${task.task} from ${task.begin} - ${task.end}`
                        return task
                    }
                    else if(
                        beginNewTask < beginCurrentTask &&
                        endNewTask > endCurrentTask     
                    ){
                        feedbackMsg = `This task is to long therfore it is within the task ${task.task} from ${task.begin} - ${task.end}`
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
























// ############# old code #############
 // const findOverlap = this.dailyTasks.filter(task=>{
                //     for(let dayInCurrentTask of task.days){
                //         for(let dayInNewTask of taskObj.days){
                //             if(dayInNewTask === dayInCurrentTask){
                //                 const beginCurrentTask = converDateToMS(task.begin)
                //                 const endCurrentTask = converDateToMS(task.end)
                //                 const beginNewTask = converDateToMS(taskObj.begin)
                //                 const endNewTask = converDateToMS(taskObj.end)
                //                 if(
                //                     beginNewTask >= beginCurrentTask && 
                //                     endNewTask <= endCurrentTask   
                //                 ){
                //                     this.feedbackMsg = `This task overlaps with the task ${task.task} from ${task.begin} - ${task.end}`
                //                     return task
                //                 }
                //                 else if(
                //                     beginNewTask >= beginCurrentTask && 
                //                     endNewTask >= endCurrentTask     &&
                //                     beginNewTask < endCurrentTask   
                //                 ){
                //                     this.feedbackMsg = `This task begins within the task ${task.task} from ${task.begin} - ${task.end}`
                //                     return task
                //                 }
                //                 else if(
                //                     beginNewTask <= beginCurrentTask &&
                //                     endNewTask <= endCurrentTask     &&
                //                     endNewTask > beginCurrentTask
                //                 ){
                //                     this.feedbackMsg = `This task ends within the task ${task.task} from ${task.begin} - ${task.end}`
                //                     return task
                //                 }
                //                 else if(
                //                     beginNewTask < beginCurrentTask &&
                //                     endNewTask > endCurrentTask     
                //                 ){
                //                     this.feedbackMsg = `This task is to long therfore it is within the task ${task.task} from ${task.begin} - ${task.end}`
                //                     return task
                //                 }
                //             }
                //         }
                //     }
                // })





 // overlapCheck.findOverlap.forEach(task=>{
                    //     const overlappingDays = task.days.filter(day=>{
                    //         if(taskObj.days.includes(day)){
                    //             return day
                    //         }
                    //     })
                    //     overlappingDays.forEach(day=>{
                    //         this.feedback.push(`${overlapCheck.feedbackMsg} on a ${day}`)
                    //     })
                    // })