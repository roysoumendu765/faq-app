const FAQ = require("../models/models");
const redisClient = require("../caching/redis");

const getData = async (req, res) => {
    try {
        const lang = req.query.lang || "en";
        const key = `query-${lang}`;

        const cachedData = await redisClient.get(key);
        if (cachedData) {
            return res.status(200).json({ message: "Data from cache", data: JSON.parse(cachedData) });
        }

        const results = await FAQ.find({}, { _id: 1, question: 1, question_hi: 1, question_bn: 1, answer: 1, answer_hi: 1, answer_bn: 1 });

        if (results.length === 0) {
            return res.status(404).json({ message: "FAQs Not Found" });
        }

        const data = results.map((faq) => ({
            id: faq._id,
            question: lang == "hi" ? faq.question_hi : lang == "bn" ? faq.question_bn : faq.question,
            answer: lang == "hi" ? faq.answer_hi : lang == "bn" ? faq.answer_bn : faq.answer,
        }));

        await redisClient.setEx(key, 60, JSON.stringify(data));
        res.status(200).json({ message: "Data Generated Successfully.", data });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const postData = async (req, res, next) => {
    try {
        clearCache("hi") // Can be Implemented in different ways
        clearCache("bn")
        clearCache("en")
        const {question, answer} = req.body;
        const newData = new FAQ({question, answer});
        await newData.save();
        res.status(200).json({message: "New FAQ Posted Successfully.", data: newData});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error.", error: error.stack});
    }
}

const clearCache = async (lang) => {
    const key = lang ? `query-${lang}` : `query-en`; 
    await redisClient.del(key);
    console.log(`Cache for ${key} cleared`);
};

module.exports = {getData, postData};