const redis = require("redis");
require('dotenv').config();

const client = redis.createClient({
    url: process.env.REDIS_URI || "redis://127.0.0.1:6381"
});

client.on("error", (err) => console.error("Redis Error:", err));
client.on("connect", () => console.log("Redis up and running"));

(async () => {
    try {
        await client.connect();
    } catch (err) {
        console.error("Redis Connection Failed:", err);
    }
})();

module.exports = client;
