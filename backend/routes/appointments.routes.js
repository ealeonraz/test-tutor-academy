import express from "express";
import db from "../models/index.js";

const router = express.Router();
router.post("/", async (req,res) => {
    try {
        const data = req.body;
        const result = db.mongoose.connection.db.collection("appointments").insertOne(data)

        res.status(201).json(result);

    } catch(err) {
        console.error(err);
        res.status(500).json({error: "Failed to submit appointment"})
    }
})