function addZero(number){
    if(Number(number)<10 && Number(number)>0) return '0'+number
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
const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ]
export {addZero, converDateToMS, days, monthNames}