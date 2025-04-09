import { getCurrentUser, signIn, signInWithGoogle } from "../../firebase/firebase.js";
import { notyfError, notyfInfo } from "../../notyf/app.js";
const googleBtn = document.getElementById("google-btn");

getCurrentUser()
    .then((user) => {
        if (user) {
            location = "../../index.html";
        }
    })
    .catch(err => notyfError(err.message));

// login handler functionality
const loginHandler = async (e) => {
    e.preventDefault();
    const email = document.getElementById("floating_email").value.trim();
    const password = document.getElementById("floating_password").value.trim();
    if (!email) {
        notyfError("Email is required");
        return;
    }
    if (!password) {
        notyfError("Password is required");
        return;
    }

    try {
        notyfInfo("Loading...");
        await signIn(email, password);
        notyfInfo("Login successful");
        setTimeout(() => location = "../../index.html", 1000);
    } catch (err) {
        notyfError(err.message);
    }
}

document.querySelector(".login-form").addEventListener("submit", loginHandler);

googleBtn.addEventListener("click", async () => {
    try {
        notyfInfo("Loading...");
        const user = await signInWithGoogle();
        if (user) {
            notyfInfo("Login successful");
            setTimeout(() => location = "../../index.html", 1000);
        } else {
            notyfInfo("Login failed. Please try again.");
        }
    } catch (error) {
        console.error("Login Error:", error.message);
        notyfInfo("Login failed. Please try again.");
    }
});
