// js/video.js

document.addEventListener("DOMContentLoaded", () => {
    const generateVideoBtn = document.getElementById("generateVideoBtn");
    const videoPromptInput = document.getElementById("videoPromptInput");
    const resultVideo = document.getElementById("resultVideo");
    const videoLoader = document.getElementById("videoLoader");
    const videoErrorBox = document.getElementById("videoErrorBox");
    const downloadVideoBtn = document.getElementById("downloadVideoBtn");
    const videoCreditBadge = document.getElementById("video-credit-badge");
    
    const creditElements = document.querySelectorAll(".profile-card p");

    if (!generateVideoBtn || !videoPromptInput) return;

    // पब्लिक वर्किंग वीडियोस की लिस्ट (CORS Allowed)
    const videoTemplates = [
        "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0227e8d780a1152a5bd30d07469b52a&profile_id=165&oauth2_token_id=57447761",
        "https://player.vimeo.com/external/409110543.sd.mp4?s=04918e984f49495470d061517409214efbf91fa4&profile_id=165&oauth2_token_id=57447761",
        "https://player.vimeo.com/external/451838634.sd.mp4?s=23d8383e2808b8b939fa9edde0f5904d9c7c00e1&profile_id=165&oauth2_token_id=57447761"
    ];

    generateVideoBtn.addEventListener("click", async () => {
        let currentCredits = parseInt(localStorage.getItem("userCredits") || "45");

        if (currentCredits < 5) {
            alert("❌ वीडियो जनरेट करने के लिए कम से कम 5 क्रेडिट्स की आवश्यकता है!");
            return;
        }

        const prompt = videoPromptInput.value.trim();
        if (!prompt) {
            alert("कृपया पहले वीडियो प्रॉम्ट बॉक्स में कुछ लिखें!");
            return;
        }

        // यूआई लोडिंग चालू करें
        generateVideoBtn.disabled = true;
        generateVideoBtn.innerText = "Rendering AI Video...";
        if (videoLoader) videoLoader.style.display = "block";
        if (resultVideo) resultVideo.style.display = "none";
        if (videoErrorBox) videoErrorBox.style.display = "none";

        try {
            // 3.5 सेकंड का रेंडरिंग टाइम सिमुलेशन
            await new Promise(resolve => setTimeout(resolve, 3500));

            // नया रैंडम वीडियो चुनें
            const randomVideo = videoTemplates[Math.floor(Math.random() * videoTemplates.length)];

            if (resultVideo) {
                resultVideo.src = randomVideo;
                resultVideo.style.display = "block";
                resultVideo.load();
                
                // ब्राउज़र DOMException को रोकने के लिए प्रॉमिस प्ले हैंडलर
                const playPromise = resultVideo.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Autoplay was prevented or interrupted:", error);
                    });
                }
            }

            if (videoLoader) videoLoader.style.display = "none";
            
            if (downloadVideoBtn) {
                downloadVideoBtn.onclick = () => {
                    window.open(randomVideo, '_blank');
                };
            }

            // 🛑 5 क्रेडिट्स माइनस करें
            currentCredits -= 5;
            localStorage.setItem("userCredits", currentCredits);

            // हेडर और साइडबार के क्रेडिट्स टेक्स्ट को अपडेट करें
            if (videoCreditBadge) {
                videoCreditBadge.innerText = `Cost: 5 Credits (Total: ${currentCredits})`;
            }
            creditElements.forEach(el => {
                el.innerHTML = `⚡ ${currentCredits} Credits Left`;
            });

        } catch (error) {
            console.error(error);
            if (videoErrorBox) {
                videoErrorBox.innerText = "❌ Video Generation Failed! Try again.";
                videoErrorBox.style.display = "block";
            }
            if (videoLoader) videoLoader.style.display = "none";
            if (resultVideo) resultVideo.style.display = "block";
        } finally {
            generateVideoBtn.disabled = false;
            generateVideoBtn.innerText = "Generate Video";
        }
    });
});