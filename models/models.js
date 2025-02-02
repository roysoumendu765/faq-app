const mongoose = require("mongoose");
const axios = require("axios");

const FAQSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    question_hi: { type: String },
    question_bn: { type: String },
    answer_hi: {type: String},
    answer_bn: {type: String}
});

const translateText = async (text, targetLang) => {
    try {
        const res = await axios.get("https://api.mymemory.translated.net/get", {
            params: { q: text, langpair: `en|${targetLang}` }
        });

        console.log(`Translation (${targetLang}):`, res.data); 

        return res.data.responseData.translatedText || text; 
    } catch (error) {
        console.error("Translation error:", error);
        return text;
    }
};

FAQSchema.pre("save", async function (next) {
    if (!this.question_hi) {
        this.question_hi = await translateText(this.question, "hi");
    }
    if (!this.question_bn) {
        this.question_bn = await translateText(this.question, "bn");
    }
    if(!this.answer_hi){
        this.answer_hi = await translateText(this.answer, "hi");
    }
    if(!this.answer_bn){
        this.answer_bn = await translateText(this.answer, "bn");
    }
    next();
});

module.exports = mongoose.model("FAQ", FAQSchema);
