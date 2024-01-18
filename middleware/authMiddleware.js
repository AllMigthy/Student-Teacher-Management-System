const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Parent = require("../models/Parent");
const Admin = require("../models/Admin");

exports.authenticateTeacher = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const teacher = await Teacher.findOne({ _id: decoded.id });

    if (!teacher) {
      throw new Error();
    }

    req.teacher = teacher;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate" });
  }
};

exports.authenticateStudent = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findOne({ _id: decoded.id });

    if (!student) {
      throw new Error();
    }

    req.student = student;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate" });
  }
};

exports.authenticateParent = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const parent = await Parent.findOne({ _id: decoded.id });

    if (!parent) {
      throw new Error();
    }

    req.parent = parent;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate." });
  }
};

exports.authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({ _id: decoded.id });

    if (!admin) {
      throw new Error();
    }

    req.admin = admin;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate" });
  }
};
