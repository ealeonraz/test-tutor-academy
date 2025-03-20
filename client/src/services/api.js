// Backend API base URL (Make sure this is correct)
const API_URL = "http://localhost:4000"; 

/**
 * Fetch all students from the backend.
 * 
 * - Sends a GET request to `/About` (modify this if your backend uses a different route)
 * - Returns an array of students or an empty array if an error occurs
 * - Handles errors gracefully to avoid breaking the app
 * 
 * @returns {Promise<Array>} List of students
 */
export const getStudents = async () => {
    try {
        const response = await fetch(`${API_URL}/About`); // Ensure this matches your backend route
        if (!response.ok) {
            throw new Error("Failed to fetch students");
        }
        return await response.json(); // Parse response JSON
    } catch (error) {
        console.error("Error fetching students:", error);
        return []; // Return an empty array to prevent crashes
    }
};

/**
 * Fetch a single student by their unique `_id` from the backend.
 * 
 * - Sends a GET request to `/students/:id` (replace with your actual backend route)
 * - Returns student data if found
 * - Handles errors and returns `null` if fetching fails
 * 
 * @param {string} studentId - The `_id` of the student to fetch
 * @returns {Promise<Object|null>} The student object or `null` if not found
 */
export const getStudentById = async (studentId) => {
    try {
        const response = await fetch(`${API_URL}/students/${studentId}`); // Ensure this matches your backend route
        if (!response.ok) {
            throw new Error("Failed to fetch student");
        }
        return await response.json(); // JSON response
    } catch (error) {
        console.error(`Error fetching student with ID ${studentId}:`, error);
        return null;
    }
};
