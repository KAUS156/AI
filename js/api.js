// js/api.js

/**
 * AI Image Generate करने का कोर फ़ंक्शन (बिना किसी टोकन या डोमेन एरर के)
 */
export async function generateImageFromAPI(prompt, style, ratio) {
    // प्रॉम्ट को प्रीमियम कीवर्ड्स के साथ मिलाना
    const finalPrompt = `${prompt}, ${style}, masterwork, 8k resolution, highly detailed, photorealistic, dramatic lighting`;
    
    // सुरक्षित यूआरएल बनाने के लिए एनकोडिंग
    const encodedPrompt = encodeURIComponent(finalPrompt.trim());
    
    // एस्पेक्ट रेश्यो (Aspect Ratio) के अनुसार डाइमेंशन्स सेट करना
    let width = 1024;
    let height = 1024;
    
    if (ratio === "16:9") {
        width = 1024;
        height = 576;
    } else if (ratio === "9:16") {
        width = 576;
        height = 1024;
    }

    // फ़ास्ट, फ्री और लाइव सर्वर यूआरएल
    const apiUrl = `https://image.pollinations.ai/p/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("AI Server is busy. Please try again in a few seconds!");
        }

        // इमेज का Blob डेटा निकालना
        const imageBlob = await response.blob();
        
        // अस्थायी रूप से देखने योग्य यूआरएल बनाना
        return URL.createObjectURL(imageBlob);

    } catch (error) {
        console.error("Fetch API Error:", error);
        throw new Error("Network Error: Unable to reach AI Server. Check internet or try another prompt.");
    }
}