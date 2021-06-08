const { descriptor } = require("../descriptor")
const grpc = require("@grpc/grpc-js")
const grpcUsers = new descriptor.users.Users("users:9001", grpc.credentials.createInsecure())


const signUp = async (req, res) => {
    try {
        const { email, password, name, iban } = req.body;

        if (email === undefined || email === null || email === "") throw "Bad Request wrong email field";
        if (password === undefined || password === null || password.length < 8) throw "Bad Request wrong password field, at least 8 chars";
        if (name === undefined || name === null || name === "") throw "Bad Request wrong name field";
        if (iban === undefined || iban === null || iban === "") throw "Bad Request wrong iban field";

        grpcUsers.signup({ email, password, name, iban }, (err, data) => {
            console.log(err, data);
            if (data) return res.status(201).json({ status: "ok", data: data.token })
            if (err) return GRPCerrorHandler(err, res)
        })


    } catch (error) {
        errorHandler(error, res)
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === undefined || email === null || email === "") throw "Bad Request wrong email field";
        if (password === undefined || password === null || password.length < 8) throw "Bad Request wrong password field, at least 8 chars";

        grpcUsers.login({ email, password }, (err, data) => {
            console.log(err, data);
            if (data) return res.status(200).json({ status: "ok", data: data.token })
            if (err) return GRPCerrorHandler(err, res)
        })

    } catch (error) {
        errorHandler(error, res)
    }
}




function GRPCerrorHandler(err, res) {
    console.log(err);
    switch (err.code) {
        case 5: {
            return res.status(404).json({ status: "rejected", cause: err.details });
        }
        case 3: {
            return res.status(400).json({ status: "rejected", cause: err.details });
        }
        case 13: {
            return res.status(409).json({ status: "rejected", cause: err.details });

        }
        case 14: {
            return res.status(400).json({ status: "rejected", cause: err.details });
        }
        case 16: {
            return res.status(403).json({ status: "rejected", cause: err.details });
        }
    }
}


function errorHandler(error, res) {
    if (typeof error != "string") return res.status(500).json({ status: "rejected", cause: `Server Error ${error.message}` })
    if (error.includes("Bad Request")) return res.status(400).json({ status: "rejected", cause: error })
    else if (error.includes("Not Found")) return res.status(404).json({ status: "rejected", cause: error })
    else if (error.includes("Forbidden")) return res.status(403).json({ status: "rejected", cause: error });
    else if (error.includes("Conflict")) return res.status(409).json({ status: "rejected", cause: error });
    return res.status(422).json({ status: "rejected", error: error });
}


module.exports = {
    signUp, login
}