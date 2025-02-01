const FAQ = require("../models/models");
const { promisify } = require("util");
const redisClient = require("../caching/redis");

const getData = async (req, res) => {
    try {
        const lang = req.query.lang || "en";
        const key = `query-${lang}`;

        const cachedData = await redisClient.get(key);

        if (cachedData) {
            console.log("Cache hit! Returning cached data.");
            return res.status(200).json({ message: "Data from cache", data: JSON.parse(cachedData) });
        }

        console.log("Cache miss! Fetching from database...");
        const results = await FAQ.find({});

        if (results.length === 0) {
            return res.status(404).json({ message: "FAQs Not Found" });
        }

        const data = results.map((t) => ({
            id: t._id,
            question: lang === "hi" ? t.ques_hi : lang === "bn" ? t.ques_bn : t.question,
            answer: lang === "hi" ? t.ans_hi : lang === "bn" ? t.ans_bn : t.answer,
        }));

        await redisClient.setEx(key, 3600, JSON.stringify(data));
        res.status(200).json({ message: "Data Generated Successfully.", data });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const postData = async (req, res, next) => {
    try {
        const {question, answer} = req.body;
        const newData = new FAQ({question, answer});
        await newData.save();
        res.status(200).json({message: "New FAQ Posted Successfully.", data: newData});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error.", error: error.stack});
    }
}

module.exports = {getData, postData};