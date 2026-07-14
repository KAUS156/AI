// js/auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// आपकी असली JSON फ़ाइल से निकाला गया परफेक्ट कॉन्फ़िगरेशन
const firebaseConfig = {
    apiKey: "AIzaSyA57wv-pk-gjZ13yvG2LCLYX9SK3xyZRTU",
    authDomain: "student-df687.firebaseapp.com",
    projectId: "student-df687",
    storageBucket: "student-df687.firebasestorage.app",
    messagingSenderId: "514801516620",
    appId: "1:514801516620:android:c410e9b00aa780d20e34e9" // ध्यान दें: यह वेब पर भी प्रामाणिकता (Auth) के लिए काम करेगा
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// 🔒 सुरक्षा और रीडायरेक्शन गार्ड
onAuthStateChanged(auth, (user) => {
    const isDashboard = window.location.pathname.includes("dashboard.html");
    const isLoginPage = window.location.pathname.includes("login.html");

    if (user) {
        localStorage.setItem("loggedInUser", user.displayName || user.email.split('@')[0]);
        if (isLoginPage) {
            window.location.href = "dashboard.html";
        }
    } else {
        if (isDashboard) {
            alert("Please login first to access the dashboard!");
            window.location.href = "login.html";
        }
    }
});

// DOM Handlers
document.addEventListener("DOMContentLoaded", () => {
    // 1. Google Login (पॉपअप लोड)
    const googleLoginBtn = document.getElementById("google-login-btn");
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener("click", async () => {
            googleLoginBtn.disabled = true;
            const originalHTML = googleLoginBtn.innerHTML;
            googleLoginBtn.innerText = "Connecting...";

            try {
                await signInWithPopup(auth, googleProvider);
                window.location.href = "dashboard.html";
            } catch (error) {
                console.error("Google Auth Error:", error);
                alert("Google Sign-In failed! Make sure 127.0.0.1 is added in Firebase Authorized Domains.");
            } finally {
                googleLoginBtn.disabled = false;
                googleLoginBtn.innerHTML = originalHTML;
            }
        });
    }

    // 2. Email Login Form
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value.trim();
            const submitBtn = loginForm.querySelector("button[type='submit']");

            submitBtn.disabled = true;
            submitBtn.innerText = "Signing In...";

            try {
                await signInWithEmailAndPassword(auth, email, password);
                window.location.href = "dashboard.html";
            } catch (error) {
                console.error("Email Auth Error:", error);
                alert("लॉगिन विफल! ईमेल या पासवर्ड गलत है।");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = "Sign In";
            }
        });
    }
});