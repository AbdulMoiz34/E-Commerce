import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCKg3uXfFuWZHvES6vBH2FuXCnyZJsgkmU",
    authDomain: "e-commerce-website-6c783.firebaseapp.com",
    projectId: "e-commerce-website-6c783",
    storageBucket: "e-commerce-website-6c783.firebasestorage.app",
    messagingSenderId: "53718391715",
    appId: "1:53718391715:web:0eb5964980d3d6599e1816",
    measurementId: "G-DG7CWF55ME"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// sign up functionality
const signUp = async (name, email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        updateProfile(auth.currentUser, {
            displayName: name,
        });
        return userCredential.user;
    }
    catch (err) {
        throw err;
    }
}

// sign in functionality
const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    }
    catch (err) {
        throw err;
    }
}

// logout functionality
const logout = async () => {
    try {
        await auth.signOut();
    }
    catch (err) {
        throw err;
    }
}

// sign in with google functionality
const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (err) {
        throw Error("❌ Popup error.");
    }
};

// get current user
const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe();
            if (user) {
                await user.reload();
                resolve(user);
            } else {
                resolve(null);
            }
        }, reject);
    });
};

export { app, analytics, signUp, signIn, logout, signInWithGoogle, getCurrentUser, auth };
