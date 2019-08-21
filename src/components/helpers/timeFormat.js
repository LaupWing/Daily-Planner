function addZero(number){
    if(number<10) return '0'+number
    else          return number
}

function converDateToMS(time){
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth()+1
    const year = date.getFullYear()
    if(time){
        const dateToConvert = new Date(`${month}/${day}/${year} ${time}:00`)
        const milliseconds = dateToConvert.getTime()
        return milliseconds
    }
    return date.getTime()
}
export {addZero, converDateToMS}