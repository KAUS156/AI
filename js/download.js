// js/download.js

document.addEventListener("DOMContentLoaded", () => {
    const downloadBtn = document.getElementById("downloadBtn");
    const resultImage = document.getElementById("resultImage");

    if (!downloadBtn || !resultImage) return;

    downloadBtn.addEventListener("click", () => {
        // चेक करें कि क्या सच में कोई इमेज जेनेरेट हुई है
        if (!resultImage.src || resultImage.style.display === "none" || resultImage.src.includes("dashboard.html")) {
            alert("कृपया डाउनलोड करने से पहले एक इमेज जेनेरेट करें!");
            return;
        }

        try {
            // एक अस्थायी एंकर (<a>) टैग बनाकर डाउनलोड ट्रिगर करना
            const a = document.createElement("a");
            a.href = resultImage.src;
            a.download = `AI_Generated_Image_${Date.now()}.png`; // यूनिक नाम से सेव होगा
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download Failed:", error);
            alert("इमेज डाउनलोड करने में समस्या आई, कृपया दोबारा प्रयास करें।");
        }
    });
});