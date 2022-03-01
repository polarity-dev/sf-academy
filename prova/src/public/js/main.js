document.addEventListener("DOMContentLoaded", function() {
    // REGISTER FORM
    const reigster_btn = document.querySelector(".register-submit");
    reigster_btn.addEventListener("click", () => {
        const user = document.querySelector("#username").value;
        const pass = document.querySelector("#password").value;
        axios
            .post(`http://localhost:8080/addUser`, {
                    username: user,
                    password: pass
            })
            .then(res => {
                if (res.status === 200) {
                    console.log(res.data);
                }
            })
            .catch();
            document.querySelector("#username").value = "";
            document.querySelector("#password").value = "";
    });    

    // LOGIN FORM
    const login_btn = document.querySelector(".login-submit");
    login_btn.addEventListener("click", () => {
        const user = document.querySelector("#username2").value;
        const pass = document.querySelector("#password2").value;
        axios
        .post("http://localhost:8080/login", {
            username: user,
            password: pass
        })
        .then((res) => {
            console.log(res.data.message);
        })
        .catch(err => { console.log(err)} );
        document.querySelector("#username2").value = "";
        document.querySelector("#password2").value = "";
    })
});
