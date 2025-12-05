const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // For v1beta, we might need to use the model manager if available, 
    // or just try to get a model and see if it works? 
    // Actually the SDK doesn't have a direct listModels method on the client instance usually?
    // Let's check if we can just use a known working model like 'gemini-1.0-pro'.

    // But let's try to see if we can find the list.
    // If not, I'll just try gemini-1.5-flash-001.

    console.log("Testing gemini-1.5-flash...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        console.log("gemini-1.5-flash works!");
    } catch (e) {
        console.log("gemini-1.5-flash failed: " + e.message);
    }

    console.log("Testing gemini-pro...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        console.log("gemini-pro works!");
    } catch (e) {
        console.log("gemini-pro failed: " + e.message);
    }

    console.log("Testing gemini-1.5-pro...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent("Hello");
        console.log("gemini-1.5-pro works!");
    } catch (e) {
        console.log("gemini-1.5-pro failed: " + e.message);
    }
}

listModels();
