// js/app.js

document.addEventListener("DOMContentLoaded", () => {
    // लोकल स्टोरेज से लॉगिन यूजर का नाम दिखाना (अगर auth.js सेट है)
    const userNameElement = document.getElementById("dashboardUserName");
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (userNameElement && loggedInUser) {
        userNameElement.innerText = loggedInUser;
    }

    // लॉगआउट बटन हैंडलर
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("loggedInUser");
            alert("सफलतापूर्वक लॉगआउट हो गया!");
            window.location.href = "login.html"; // लॉगआउट के बाद लॉगिन पेज पर भेजें
        });
    }

    console.log("App Module Loaded Successfully 🚀");
});