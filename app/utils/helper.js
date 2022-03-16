
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