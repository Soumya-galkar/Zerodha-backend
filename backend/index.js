


const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const authRoute = require("./Routes/AuthRoute");

const uploadRoute = require("./rag/routes/uploadRoute");
const chatRoute = require("./rag/routes/chat");

const app = express();


// =========================
// Middleware
// =========================

app.use(
    cors({
        origin: [
            "http://localhost:3001",
            "http://localhost:3000",
            "https://zerodha-dashboard-chgd.onrender.com"
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser());


// =========================
// MongoDB
// =========================

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("connected to mongodb");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });


// =========================
// Dashboard Routes
// =========================

app.get("/allHoldings", async (req, res) => {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
});

app.post("/newOrder", async (req, res) => {

    const newOrder = new OrdersModel({
        name: req.body.name,
        qty: req.body.qty,
        price: req.body.price,
        mode: req.body.mode
    });

    await newOrder.save();

    res.send("order saved!!");
});




app.use("/rag", uploadRoute);
app.use("/rag/chat", chatRoute);


// =========================
// Auth
// =========================

app.use("/", authRoute);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Zerodha backend is running"
    });
});

// =========================
// Server
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
