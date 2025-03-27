import express from "express";
import connectDB from "../database/db.js"; // Import the database connection function
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

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

/**
 * @route   POST /register
 * @desc    Register a new account in the database
 * @access  Public
 */
router.post("/register", async (req, res) => {
  try {
    const db = await connectDB();

    const collection = db.collection("users");

    const{first, last, email, password, confirmPassword} = req.body;

    // Case 1 - account exists
    const existingStudent = await collection.findOne({email});
    if(existingStudent) {
      res.status(400).json({
        error: "Email already in use",
      })
    }
    // Case 2 - new account
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newStudent = {
      firstName: first,
      lastName: last,
      email: email,
      password: hashedPassword,
      role: "student",
      tutor: null,
    } 
    const result = await collection.insertOne(newStudent);
    res.status(201).json({
      message: "Feedback submit",
      id: result.insertedId,
    });
    // Case 3 - invalid email
    // Case 4 - passwords don't match

    
  }
  catch (error) {
    console.error("Failed to create account");
    res.status(500).json({ error: "Failed to create account"});
  }
});



export default router;