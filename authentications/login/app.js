import { getCurrentUser, signIn, signInWithGoogle, setupRecaptcha, signInWithPhoneNumber, auth } from "../../firebase/firebase.js";
import { notyfError, notyfInfo } from "../../notyf/app.js";
const phoneSignUpBtn = document.getElementById("phone-signup-btn");
const backBtn = document.getElementById("back-btn");
const loginBox = document.getElementById("login-box");
const phoneLoginBox = document.getElementById("phone-login-box");
const googleBtn = document.getElementById("google-btn");
const sendCodeBtn = document.getElementById("send-code-btn");
const phoneScreen = document.getElementById("phone-screen");
const otpScreen = document.getElementById("otp-screen");
const otpInput = document.getElementById("otp-code");
const confirmOtpBtn = document.getElementById("confirm-otp-btn");

getCurrentUser()
    .then((user) => {
        if (user) {
            location = "../../index.html";
        }
    })
    .catch(err => notyfError(err.message));

// toggle screen functionality
const toggleScreen = () => {
    loginBox.classList.toggle("hidden");
    phoneLoginBox.classList.toggle("hidden");
}

// login handler functionality
const loginHandler = async () => {
    event.preventDefault();
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
        const user = await signIn(email, password);
        notyfInfo("Login successful");
        setTimeout(() => location = "../../index.html", 1000);
    } catch (err) {
        notyfError(err.message);
    }
}

// login with phone number functionality
const loginWithNumber = async () => {
    const phoneNumber = document.getElementById("phone-number").value.trim();

    if (!phoneNumber) {
        notyfError("Phone number is required");
        return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
        notyfError("Please enter a valid 10-digit phone number");
        return;
    }

    try {
        notyfInfo("Sending OTP...");
        initRecaptcha();
        console.log("true");
        // await loginWithPhone(phoneNumber);
        notyfInfo("OTP sent successfully!");

        // Show OTP screen
        // phoneScreen.classList.add("hidden");
        // otpScreen.classList.remove("hidden");
    } catch (error) {
        notyfError(error.message);
    }
}

// Setup reCAPTCHA when page loads

const sendOtp = async (phoneNumber) => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    try {
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        console.log("📲 OTP sent!", confirmationResult);
        window.confirmationResult = confirmationResult;
    } catch (error) {
        console.error("❌ Error sending OTP:", error.message);
    }
};

// verify otp functionality
const verifyOtpHandler = async () => {
    const otp = otpInput.value.trim();
    if (!otp) {
        notyfError("OTP is required");
        return;
    }

    try {
        notyfInfo("Verifying OTP...");
        const user = await verifyOtp(otp);
        notyfInfo("OTP verified successfully!");
        setTimeout(() => location = "../../index.html", 1000);
    }
    catch (error) {
        notyfError(error.message);
    }
}


backBtn.addEventListener("click", toggleScreen);
phoneSignUpBtn.addEventListener("click", toggleScreen);
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

sendCodeBtn.addEventListener("click", () => {
    sendOtp("+923122361229");
});
confirmOtpBtn.addEventListener("click", verifyOtpHandler);
