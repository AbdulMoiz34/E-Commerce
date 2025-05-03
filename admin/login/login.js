import { adminLoginHandler } from "../../firebase/firebase.js";


const notyf = new Notyf();
const form = document.getElementById("admin-login-form");
const isLoggedIn = localStorage.getItem("admin");
if (isLoggedIn) {
    location = "../index.html";
}

const loginHandler = async () => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    console.log(username, password);
    try {
        const adminData = await adminLoginHandler();
        if (username == adminData.username && password == adminData.password) {
            notyf.success("Login successful");
            localStorage.setItem("admin", true);
            setTimeout(() => location = "../index.html", 1000);
        } else {
            notyf.error("Invalid credentials");
        }
    } catch (err) {
        notyf.error(err.message);
    }
}


form.addEventListener("submit", loginHandler);
AOS.init();
