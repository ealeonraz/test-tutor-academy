import express from "express";
import connectDB from "../database/db.js"; // Ensure this path is correct
import { ObjectId } from "mongodb";

const router = express.Router();

// Retrieves all students from the database, uncomment this to practiec. Visit localhost:3000/ to see the contents.

router.get("/About", async (req, res) => {
    try {
        const db = await connectDB(); // Await the database connection
        const collection = db.collection("students"); // Access the collection
        const results = await collection.find({}).toArray();
        
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: "Failed to fetch students" });
    }
});


export default router;