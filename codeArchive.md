*   DailiyView
```js
setTimeIndicator(){
    const scrolled = this.$el.scrollTop
    const height = this.$el.offsetHeight
    const midpoint = Math.round(scrolled + (height/2))
    this.calcStartingPoint()
    this.$el.querySelectorAll('#Timeline li').forEach(li=>{
        const max = li.offsetTop + li.offsetHeight
        const min = li.offsetTop
        if(midpoint >= min && midpoint <= max){
            const liTime = li.dataset.time
            const comparePoint = Math.round(li.offsetTop + (li.offsetHeight/2))
            const oneMinuteInPx = li.offsetHeight/30
            let time = '00:00'
        if(midpoint===comparePoint){
            time = liTime
        }
        else if(midpoint > comparePoint){
            const minutesDiffrence = Math.round((midpoint-comparePoint)/oneMinuteInPx)
            const liTimeHours =  Number(liTime.split(':')[0])
            const liTimeMinutes = Number(liTime.split(':')[1])
            time = `${this.addZero(liTimeHours)}:${this.addZero(liTimeMinutes+minutesDiffrence)}` 
        }
        else if(midpoint < comparePoint){
            const minutesDiffrence = Math.round((comparePoint-midpoint)/oneMinuteInPx)
            let liTimeHours =  Number(liTime.split(':')[0])
            let liTimeMinutes = Number(liTime.split(':')[1])
            if(liTimeMinutes === 0 ){
                liTimeHours = (liTimeHours !== 0) ? liTimeHours - 1 : 23
                liTimeMinutes = 60-minutesDiffrence
                time = `${this.addZero(liTimeHours)}:${this.addZero(liTimeMinutes)}`
            }else{
                time = `${this.addZero(liTimeHours)}:${this.addZero(liTimeMinutes-minutesDiffrence)}`
            }
        }
        document
                .querySelector('#planner .indicator')
                .setAttribute('time', `${time}`)
        }
    })
},
```