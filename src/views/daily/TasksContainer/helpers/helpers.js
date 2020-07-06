export function fiveMinuteCoords(){
    const lis = document.querySelectorAll('#Timeline li')
    const coords = []

    const create3MinuteBefore = (li, hour, minute, fiveMinuteCoord)=>{
        for(let x=3; x>0; x--){
            const newMinute = (minute - (5*x)) < 0 ?
                60 - (5*x) : minute - (5*x)
            const newHour = (minute - (5*x)) < 0 ?
                hour - 1 : hour
            coords.push({
                time: `${newHour < 10 ? '0'+ newHour: newHour}:${newMinute < 10 ? '0'+ newMinute: newMinute}`,
                coord: (li.offsetTop + (li.offsetHeight / 2)) - fiveMinuteCoord * x
            })
        }
    }
    const create2MinuteAfter = (li, hour, minute, fiveMinuteCoord)=>{
        for(let x=1; x<=2; x++){
            const newMinute = minute + (5*x)
            coords.push({
                time: `${hour < 10 ? '0'+ hour: hour}:${newMinute < 10 ? '0'+ newMinute: newMinute}`,
                coord: (li.offsetTop + (li.offsetHeight / 2)) + fiveMinuteCoord * x
            })
        }
    }

    lis.forEach((li,i)=>{
        const minuteCoord = li.offsetHeight / 30
        const hour = Number(li.textContent.includes(':') 
            ? li.textContent.split(':')[0]
            : lis[i-1].textContent.split(':')[0])
        const minute = Number(li.textContent.includes(':') 
            ? li.textContent.split(':')[1]
            : 30)
        const fiveMinuteCoord = (minuteCoord * 5)
        if(!i){
            coords.push({
                time: li.textContent,
                coord:li.offsetTop + (li.offsetHeight / 2)
            })
            create2MinuteAfter(li, hour, minute, fiveMinuteCoord)
        }
        else if(i=== (lis.length-1)){
            create3MinuteBefore(li, 24, minute, fiveMinuteCoord)
            coords.push({
                time: `${hour < 10 ? '0'+ hour: hour}:${minute < 10 ? '0'+ minute: minute}`,
                coord: (li.offsetTop + (li.offsetHeight / 2))
            })
        }
        else{
            create3MinuteBefore(li, hour, minute, fiveMinuteCoord)
            coords.push({
                time: `${hour < 10 ? '0'+ hour: hour}:${minute < 10 ? '0'+ minute: minute}`,
                coord: (li.offsetTop + (li.offsetHeight / 2))
            })
            create2MinuteAfter(li, hour, minute, fiveMinuteCoord)
        }
    })
    return coords
}

export function getClosestCoord(goal){
    return fiveMinuteCoords()
        .reduce((prev, curr)=> {
            return (Math.abs(curr.coord - goal) < Math.abs(prev.coord - goal) ? curr : prev)
        })
}

export function pointOverlappedTask(start, end){
    const tasks = Array.from(document.querySelectorAll('#Tasks .task'))
    const overlapped = tasks.find(t=>{
        return (end > t.offsetTop && end < (t.offsetTop + t.offsetHeight)) ||
        ((start < t.offsetTop) && (end > (t.offsetTop + t.offsetHeight))) 
    })
    return overlapped
}

export function overlapTask(point){
    const tasks = Array.from(document.querySelectorAll('#Tasks .task'))
    const overlapped = tasks.find(t=>{
        return (point >= t.offsetTop && point <= (t.offsetTop + t.offsetHeight))
    })
    // if(overlapped){
    //     console.log(point)
    //     console.log(overlapped.offsetTop)
    //     console.log(point > overlapped.offsetTop)
    //     console.log(overlapped.offsetTop + overlapped.offsetHeight)
    //     console.log(point < (overlapped.offsetTop + overlapped.offsetHeight))
    // }
    return overlapped
}

export function getCoordOfTime({hour, minute}){
    const lis = Array.from(document.querySelectorAll('#Timeline li'))
    const pixelPerMinute = lis[0].offsetHeight / 30
    const matchingHour = lis.find(x=>Number(x.textContent.split(':')[0])===Number(hour))
    const hourCoord = matchingHour.offsetTop + (matchingHour.offsetHeight/2) 
    
    return hourCoord + (pixelPerMinute * minute)
}