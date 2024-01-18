const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Parent = require("../models/Parent");
const Admin = require("../models/Admin");

const dotenv = require("dotenv");
dotenv.config();

exports.registerTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please Enter all the Fields" });
    }

    const teacher = new Teacher({ name, email, password });
    await teacher.save();

    const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please Enter all the Fields" });
    }

    const student = new Student({ name, email, password });
    await student.save();

    // Generate a token and send it in the response
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email }).select("+password");

    if (teacher && (await teacher.comparePassword(password))) {
      const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid Email or Password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email }).select("+password");

    if (student && (await student.comparePassword(password))) {
      const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid Email or Password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.registerParent = async (req, res) => {
  try {
    const { name, email, password, studentIds } = req.body;
    console.log("Received studentIds:", studentIds);
    const parent = new Parent({ name, email, password });
    // Find the students and link them to the parent
    const students = await Student.find({ _id: { $in: studentIds } });
    console.log("Found students:", students);

    if (!students || students.length === 0) {
      return res.status(404).json({ error: "Students not found" });
    }

    parent.students = students.map((student) => student._id);
    await parent.save();

    // Add the parent to the students' parents array
    for (const student of students) {
      student.parents.push(parent._id);
      await student.save();
    }

    const token = jwt.sign({ id: parent._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.loginParent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const parent = await Parent.findOne({ email }).select("+password");

    if (parent && (await parent.comparePassword(password))) {
      const token = jwt.sign({ id: parent._id }, process.env.JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid Email or Password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please Enter all the Fields" });
    }

    const admin = new Admin({ name, email, password });
    await admin.save();

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email }).select("+password");

    if (admin && (await admin.comparePassword(password))) {
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid Email or Password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.logoutAdmin = (req, res) => {
  res.json({ success: true, message: "Admin logged out successfully" });
};

exports.logoutTeacher = (req, res) => {
  res.json({ success: true, message: "Teacher logged out successfully" });
};

exports.logoutStudent = (req, res) => {
  res.json({ success: true, message: "Student logged out successfully" });
};

exports.logoutParent = (req, res) => {
  res.json({ success: true, message: "Parent logged out successfully" });
};
