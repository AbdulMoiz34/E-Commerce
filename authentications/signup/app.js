import { signUp, getCurrentUser } from "../../firebase/firebase.js";
import { notyfInfo, notyfError } from "../../notyf/app.js";

getCurrentUser().then((user) => {
    if (user) {
        location = "../../index.html";
    }
}).catch(err => notyfError(err.message));

const signUpHandler = async (e) => {
    e.preventDefault();
    const username = document.getElementById("floating_first_name").value.trim();
    const email = document.getElementById("floating_email").value.trim();
    const password = document.getElementById("floating_password").value.trim();
    const confirmPassword = document.getElementById("floating_repeat_password").value;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!username) {
        notyfError("Name is required");
        return;
    }
    if (password.length < 6) {
        notyfError("Password must be at least 6 characters");
        return;
    }
    if (password.includes(" ")) {
        notyfError("Password must not contain spaces");
        return;
    }
    if (!specialCharRegex.test(password)) {
        notyfError("Password must contain at least one special character");
        return;
    }
    if (!/[0-9]/.test(password)) {
        notyfError("Password must contain at least one number");
        return;
    }

    if (password !== confirmPassword) {
        notyfError("Password and confirm password must be same");
        return;
    }
    try {
        notyfInfo("Loading...");
        await signUp(username, email, password);
        notyfInfo("Signup successful");
        setTimeout(() => location = "../login/index.html", 1000);
    } catch (err) {
        notyfError(err.message);
    }
}

document.querySelector(".sign-up-form").addEventListener("submit", signUpHandler);