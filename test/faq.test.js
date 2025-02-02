const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const FAQ = require("../models/models");
const sinon = require("sinon");

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri);
    }
});

beforeEach(async () => {
    await FAQ.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

jest.setTimeout(30000);

describe("FAQ API & Model Tests", () => {
    // Test 1: Creating FAQ with Translations
    it("Should save FAQ with translations", async () => {
        const faqData = {
            question: "What is Node.js?",
            answer: "Node.js is a JavaScript runtime."
        };

        const faq = new FAQ(faqData);
        await faq.save();

        expect(faq.question_hi).not.toEqual(faq.question);
        expect(faq.question_bn).not.toEqual(faq.question);
        expect(faq.answer_hi).not.toEqual(faq.answer);
        expect(faq.answer_bn).not.toEqual(faq.answer);
    });

    // Test 2: Test for Missing Translations
    it("Should generate missing translations when saving FAQ", async () => {
        const faqData = {
            question: "What is MongoDB?",
            answer: "MongoDB is a NoSQL database."
        };

        const faq = new FAQ(faqData);
        await faq.save();

        expect(faq.question_hi).not.toBe("");
        expect(faq.question_bn).not.toBe("");
        expect(faq.answer_hi).not.toBe("");
        expect(faq.answer_bn).not.toBe("");
    });

    // Test 3: Fetching FAQ via API with Translations
    it("Should return the FAQ in the requested language", async () => {
        const faqData = {
            question: "What is Node.js?",
            answer: "Node.js is a JavaScript runtime.",
            question_hi: "Node.js क्या है?",
            answer_hi: "Node.js एक जावास्क्रिप्ट रनटाइम है।",
            question_bn: "Node.js কি?",
            answer_bn: "Node.js একটি জাভাস্ক্রিপ্ট রানটাইম।"
        };

        await request(app)
            .post("/api/faqs")
            .send(faqData);

        const resHi = await request(app).get("/api/faqs?lang=hi");
        expect(resHi.body.data[0].question).toBe("Node.js क्या है?");

        const resBn = await request(app).get("/api/faqs?lang=bn");
        expect(resBn.body.data[0].question).toBe("Node.js কী?");
    });

    // Test 4: Missing Fields in POST Request
    it("Should return an error if question or answer is missing in POST request", async () => {
        const faqData = { question: "What is Node.js?" };

        const res = await request(app)
            .post("/api/faqs")
            .send(faqData);

        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Internal Server Error.");
    });

    // Test 5: Invalid Language Query Parameter
    it("Should return the default language data for invalid lang parameter", async () => {
        const faqData = {
            question: "What is MongoDB?",
            answer: "MongoDB is a NoSQL database."
        };

        await request(app)
            .post("/api/faqs")
            .send(faqData);

        const res = await request(app).get("/api/faqs?lang=xyz");
        expect(res.status).toBe(200);
        expect(res.body.data[0].question).toBe("What is MongoDB?");
    });

    // Test 6: Check Cached Data
    it("Should return cached data on subsequent requests", async () => {
        const faqData = {
            question: "What is Express?",
            answer: "Express is a web framework for Node.js."
        };

        await request(app)
            .post("/api/faqs")
            .send(faqData);

        const res1 = await request(app).get("/api/faqs");
        expect(res1.status).toBe(200);
        expect(res1.body.data).toBeInstanceOf(Array);
        expect(res1.body.data.length).toBeGreaterThan(0);

        const res2 = await request(app).get("/api/faqs");
        expect(res2.status).toBe(200);
        expect(res2.body.data).toEqual(res1.body.data);
    });

});
