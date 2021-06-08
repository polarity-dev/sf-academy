const jwt = require('jsonwebtoken')
const validate = (token) => {
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        //const decoded = jwt.decode(token, process.env.JWT_SECRET);
        //console.log(jwt.decode(token));
    } catch (error) {
        throw "AUTH_ERROR"
    }
}



const getDecoded = (token) => {
    return jwt.decode(token, process.env.JWT_SECRET)
}

module.exports = {
    validate, getDecoded
}