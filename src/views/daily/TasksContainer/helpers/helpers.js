export function fiveMinuteCoords(){
    const lis = document.querySelectorAll('#Timeline li')
    const coords = []
    lis.forEach((li,i)=>{
        const minuteCoord = li.offsetHeight / 30
        const hour = Number(li.textContent.includes(':') 
            ? li.textContent.split(':')[0]
            : lis[i-1].textContent.split(':')[0])
        const minute = Number(li.textContent.includes(':') 
            ? li.textContent.split(':')[1]
            : 30)
        // console.log({
        //     hour,
        //     minute
        // })
        if(!i){
            coords.push({
                time: li.textContent,
                coord:li.offsetTop + (li.offsetHeight / 2)
            })
            for(let x=1; x<=2; x++){
                const newMinute = minute + (5*x)
                coords.push({
                    time: `${hour < 10 ? '0'+ hour: hour}:${newMinute < 10 ? '0'+ newMinute: newMinute}`,
                    coord: (li.offsetTop + (li.offsetHeight / 2)) + minuteCoord * x
                })
            }
        }else{
            for(let x=3; x>0; x--){
                const newMinute = (minute - (5*x)) < 0 ?
                    60 - (5*x) : minute - (5*x)
                const newHour = (minute - (5*x)) < 0 ?
                    hour - 1 : hour
                coords.push({
                    time: `${newHour < 10 ? '0'+ newHour: newHour}:${newMinute < 10 ? '0'+ newMinute: newMinute}`,
                    coord: (li.offsetTop + (li.offsetHeight / 2)) + minuteCoord * x
                })
            }
            coords.push({
                time: `${hour < 10 ? '0'+ hour: hour}:${minute < 10 ? '0'+ minute: minute}`,
                coord: (li.offsetTop + (li.offsetHeight / 2))
            })
        }
    })
    console.log(coords)
}