import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    updateEmail,
    updatePassword,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendEmailVerification,
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
export const db = getFirestore(app);

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

// get all products functionality
const getAllProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push(doc.data());
        });
        return products;
    } catch (error) {
        console.error("Error getting products: ", error);
        return [];
    }
};

// get sales products functionality
const getSalesProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "sales"));
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push(doc.data());
        });
        return products;;
    } catch (err) {
        console.log(err);
    }
}

// verify email functionality
const verifyEmail = async () => {
    try {
        await sendEmailVerification(auth.currentUser);
        return "Email verification sent";
    } catch (err) {
        throw err;
    }
}

// update username functionality
const updateUsername = async (updatedName) => {
    try {
        await updateProfile(auth.currentUser, {
            displayName: updatedName
        });
        return "Name updated successfully";
    } catch (err) {
        throw err;
    }
}

// update email functionality
const updateEmailFirebase = async (email) => {
    try {
        await updateEmail(auth.currentUser, email);
        return "Email updated successfully";
    } catch (err) {
        throw err;
    }
}

// update password functionality
const updatePasswordFirebase = async (newPassword) => {
    try {
        await updatePassword(auth.currentUser, newPassword);
        return "Password updated successfully";
    } catch (err) {
        throw err;
    }
}

// firebase admin login handler
const adminLoginHandler = async () => {
    try {
        const adminRef = doc(db, "admin", "CS5mqnMCWYzflnexVCVR");
        const adminSnap = await getDoc(adminRef);
        return adminSnap.data();
    } catch (err) {
        throw err;
    }
}


// add product handler in admin
const addProductHandler = async (product) => {
    try {
        await addDoc(collection(db, "products"), { ...product, createdAt: serverTimestamp() });
        return "Product added successfully";
    } catch (err) {
        throw err;
    }
}

export { app, analytics, signUp, signIn, logout, signInWithGoogle, getCurrentUser, auth, getAllProducts, getSalesProducts, verifyEmail, updateUsername, updateEmailFirebase, updatePasswordFirebase, adminLoginHandler, addProductHandler };