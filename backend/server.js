const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = process.env.API_URL;
const API_TOKEN = process.env.API_TOKEN
app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;
        console.log("Received message:", message);

        // Format the request payload
        const payload = {
            input: {
                question: message,
            },
        };

        console.log(
            "Sending payload to Langflow:",
            JSON.stringify(payload, null, 2)
        );

        const response = await axios.post(API_URL, payload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_TOKEN}`,
            },
        });

        console.log(
            "Raw API Response:",
            JSON.stringify(response.data, null, 2)
        );

        // Extract the message from the nested response structure
        let botResponse = null;

        if (response.data?.outputs?.[0]?.outputs?.[0]?.messages?.[0]?.message) {
            botResponse =
                response.data.outputs[0].outputs[0].messages[0].message;
        }

        if (!botResponse) {
            console.log(
                "Could not find message in response structure:",
                response.data
            );
            botResponse =
                "I apologize, but I am unable to process your request at the moment.";
        }

        res.json({ response: botResponse });
    } catch (error) {
        console.error("API Error:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
        });

        res.status(500).json({
            error: "Failed to process your request",
            details: {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            },
        });
    }
});

const PORT = process.env.PORT;

// Kill any existing process on PORT 3007
const { execSync } = require("child_process");
try {
    execSync(`lsof -ti:${PORT} | xargs kill -9`);
} catch (error) {
    // Ignore errors if no process was found
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("API URL:", API_URL);
});
