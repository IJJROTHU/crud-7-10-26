const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Student = require("./models/student");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error.message);
  });


// ================= CREATE =================
app.post("/api/students", async (req, res) => {
  try {
    const student = new Student(req.body);

    const savedStudent = await student.save();

    res.status(201).json({
      message: "Student created successfully",
      student: savedStudent
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});


// ================= READ =================
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// ================= UPDATE =================
app.put("/api/students/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
      student: updatedStudent
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});


// ================= DELETE =================
app.delete("/api/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});


// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Student Management API is running");
});


// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});