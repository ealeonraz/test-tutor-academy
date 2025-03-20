import express from "express";
import connectDB from "../database/db.js"; // Import the database connection function
import { ObjectId } from "mongodb";

const router = express.Router();

/**
 * @route   GET /About
 * @desc    Retrieve all students from the database
 * @access  Public
 */
router.get("/", async (req, res) => {
    try {
        // Connect to the database
        const db = await connectDB(); 
        
        // Access the "students" collection(Students table in the database)
        const collection = db.collection("students"); 
        
        // Retrieve all student records and convert them to an array
        const results = await collection.find({}).toArray();
        
        // Send the retrieved student data back to '/About' as a JSON response
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching students:", error);
        
        // Send a 500 Internal Server Error response if something goes wrong
        res.status(500).json({ error: "Failed to fetch students" });
    }
});

export default router;
