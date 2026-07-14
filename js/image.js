// js/image.js
import { generateImageFromAPI } from './api.js';

document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generateBtn");
    const promptInput = document.getElementById("promptInput");
    const styleSelect = document.getElementById("styleSelect");
    const ratioSelect = document.getElementById("ratioSelect");
    const resultImage = document.getElementById("resultImage");
    const loader = document.getElementById("loader");
    const placeholderText = document.getElementById("placeholderText");
    const errorBox = document.getElementById("errorBox");
    const downloadBtn = document.getElementById("downloadBtn");
    
    // क्रेडिट्स दर्शाने वाले एलिमेंट्स (Sidebar और Header दोनों जगह के लिए)
    const creditElements = document.querySelectorAll(".profile-card p, .credit-badge");

    // 1. पेज लोड होते ही चेक करना कि LocalStorage में क्रेडिट है या नहीं
    let currentCredits = localStorage.getItem("userCredits");
    if (currentCredits === null) {
        currentCredits = 45; // डिफ़ॉल्ट क्रेडिट्स सेट करें
        localStorage.setItem("userCredits", currentCredits);
    } else {
        currentCredits = parseInt(currentCredits);
    }

    // यूआई पर क्रेडिट्स अपडेट करने का फंक्शन
    function updateCreditUI() {
        creditElements.forEach(el => {
            if (el.classList.contains("credit-badge")) {
                el.innerText = `Cost: 1 Credit (Total: ${currentCredits})`;
            } else {
                el.innerHTML = `⚡ ${currentCredits} Credits Left`;
            }
        });

        // अगर क्रेडिट खत्म हो गए तो बटन डिसेबल करें
        if (currentCredits <= 0) {
            generateBtn.disabled = true;
            generateBtn.innerText = "No Credits Left ❌";
            generateBtn.style.backgroundColor = "#3f3f46";
        }
    }

    // पहली बार स्क्रीन लोड होने पर रन करें
    updateCreditUI();

    if (!generateBtn || !promptInput) return;

    generateBtn.addEventListener("click", async () => {
        // सुरक्षा जांच: क्या यूजर के पास क्रेडिट है?
        if (currentCredits <= 0) {
            alert("आपके पास क्रेडिट्स समाप्त हो चुके हैं! कृपया प्लान अपग्रेड करें।");
            return;
        }

        const prompt = promptInput.value.trim();
        const style = styleSelect ? styleSelect.value : "Cinematic 8K";
        const ratio = ratioSelect ? ratioSelect.value : "1:1";

        if (!prompt) {
            alert("कृपया पहले प्रॉम्ट (Prompt) बॉक्स में कुछ लिखें!");
            return;
        }

        // लोडिंग स्टेट सक्रिय करना
        generateBtn.disabled = true;
        generateBtn.innerText = "Generating...";
        if (loader) loader.style.display = "block";
        if (resultImage) resultImage.style.display = "none";
        if (placeholderText) placeholderText.style.display = "none";
        if (errorBox) errorBox.style.display = "none";
        if (downloadBtn) downloadBtn.style.display = "none";

        try {
            // API से इमेज लिंक प्राप्त करना
            const imageUrl = await generateImageFromAPI(prompt, style, ratio);
            
            // इमेज लोड होने पर यूआई अपडेट करना
            if (resultImage) {
                resultImage.src = imageUrl;
                resultImage.style.display = "block";
            }
            if (loader) loader.style.display = "none";
            if (downloadBtn) downloadBtn.style.display = "block";

            // 🛑 सफलता पर 1 क्रेडिट कम करें (Credit Loss Logic)
            currentCredits -= 1;
            localStorage.setItem("userCredits", currentCredits);
            updateCreditUI(); // स्क्रीन पर तुरंत नया क्रेडिट दिखाएं
            
        } catch (error) {
            if (errorBox) {
                errorBox.innerText = `❌ ${error.message}`;
                errorBox.style.display = "block";
            }
            if (loader) loader.style.display = "none";
            if (placeholderText) placeholderText.style.display = "block";
        } finally {
            // अगर क्रेडिट बचे हैं तो बटन रीसेट करें
            if (currentCredits > 0) {
                generateBtn.disabled = false;
                generateBtn.innerText = "Generate Image";
            }
        }
    });
});