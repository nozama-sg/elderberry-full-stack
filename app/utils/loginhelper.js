
const valPw = (pw) => {
    if (pw.length < 8) {
        return false
    }

    return true
}

const valUsername = (username) => {
    if (username.length == 0) {
        return false
    }

    return true
}

export {
    valPw, valUsername
}

const dateToStr = (d) => {
    const dayArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
    const monArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

    const toTwoPlace = (num) => {
        return num.toString().length > 1 ? num : '0' + num.toString()
    }

    return `${dayArr[d.getDay()]}, ${d.getDate()} ${monArr[d.getMonth()]} ${d.getFullYear()} ${d.getHours()}:${toTwoPlace(d.getMinutes())}:${toTwoPlace(d.getSeconds())}`
}