import { getCurrentUser, logout, verifyEmail, updateUsername, updateEmailFirebase, updatePasswordFirebase } from "../firebase/firebase.js";
import { notyfError, notyfInfo } from "../notyf/app.js";

const navLoggedInIcons = document.querySelector(".nav-logged-in-icons");
const logoutBtn = document.getElementById("logout-btn");
const emailVerifiedEl = document.getElementById("email-verified");
const verifyBtn = document.getElementById("verify-btn");
const saveBtn = document.getElementById("save-btn");

// user profile handler functionality
const userProfileHandler = async () => {
    const usernameEl = document.getElementById("user-name");
    try {
        usernameEl.textContent = "Loading...";
        emailVerifiedEl.textContent = "Loading...";
        const user = await getCurrentUser();
    console.log(user);

        if (!user) {
            location = "../authentications/login/index.html";
            return;
        }
        usernameEl.innerHTML = `Welcome! <span class="text-[#DB4444] font-semibold">${user.displayName}</span>`;
        navLoggedInIcons.classList.remove("hidden");
        if (user.emailVerified) {
            emailVerifiedEl.textContent = "True";
            emailVerifiedEl.classList.replace("text-red-500", "text-green-500");
            verifyBtn.classList.add("hidden");
        } else {
            emailVerifiedEl.textContent = "False";
            verifyBtn.classList.remove("hidden");
        }
    } catch (err) {
        notyfError(err.message);
    }
}

// verify email functionality
const verifyEmailHandler = async () => {
    try {
        const msg = await verifyEmail();
        notyfInfo(msg);
    } catch (err) {
        notyfError(err.message);
    }
}

// update name functionality
const updateNameHandler = async (updatedName) => {
    try {
        saveBtn.disabled = true;
        const msg = await updateUsername(updatedName);
        notyfInfo(msg);
    } catch (err) {
        notyfError(err.message);
    } finally {
        saveBtn.disabled = false;
    }
}

// update email functionality
const updateEmailHandler = async (updatedEmail) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedEmail)) {
        notyfError("Invalid email");
        return;
    }
    try {
        saveBtn.disabled = true;
        const msg = await updateEmailFirebase(updatedEmail);
        notyfInfo(msg);
    } catch (err) {
        notyfError(err.message);
    } finally {
        saveBtn.disabled = false;
    }
}

// update password functionality
const updatePasswordHandler = async (newPassword) => {
    const confirmPassword = document.getElementById("confirm-password").value;
    if (newPassword !== confirmPassword) {
        notyfError("Passwords do not match");
        return;
    }
    try {
        saveBtn.disabled = true;
        const msg = await updatePasswordFirebase(newPassword);
        notyfInfo(msg);
    } catch (err) {
        notyfError(err.message);
    } finally {
        saveBtn.disabled = false;
    }
}

// update profile functionality
const updateProfileHandler = async () => {
    const updatedName = document.getElementById("updated-name").value.trim();
    const updatedEmail = document.getElementById("updated-email").value.trim();
    const newPassword = document.getElementById("new-password").value;
    if (updatedName) {
        updateNameHandler(updatedName);
    }
    if (updatedEmail) {
        updateEmailHandler(updatedEmail);
    }
    if (newPassword) {
        updatePasswordHandler(newPassword);
    }
}

userProfileHandler();
verifyBtn.addEventListener("click", verifyEmailHandler);
saveBtn.addEventListener("click", updateProfileHandler);
logoutBtn.addEventListener("click", async () => {
    await logout();
    navLoggedInIcons.classList.add("hidden");
});