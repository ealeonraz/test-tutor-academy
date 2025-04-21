import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
      minLength: 6, // Ensure password length is at least 6
    },
    subjects: [

    ],
    students:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'

        }
    ],
    profileLink: {
      type: String,
      required: false,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        // You can leave the roles array empty initially
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Tutor = mongoose.model('Tutor', tutorSchema);
export default Tutor;
