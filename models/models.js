const mongoose = require("mongoose");
const axios = require("axios");

const FAQSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    ques_hi: { type: String },
    ques_bn: { type: String },
    ans_hi: {type: String},
    ans_bn: {type: String}
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
    if (!this.ques_hi) {
        this.ques_hi = await translateText(this.question, "hi");
    }
    if (!this.ques_bn) {
        this.ques_bn = await translateText(this.question, "bn");
    }
    if(!this.ans_hi){
        this.ans_hi = await translateText(this.answer, "hi");
    }
    if(!this.ans_bn){
        this.ans_bn = await translateText(this.answer, "bn");
    }
    next();
});

module.exports = mongoose.model("FAQ", FAQSchema);
