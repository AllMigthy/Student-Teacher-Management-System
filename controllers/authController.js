const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const dotenv = require('dotenv');
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.registerStudent = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Please Enter all the Fields" });
        }

        const student = new Student({ name, email, password});
        await student.save();

        // Generate a token and send it in the response
        const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.loginTeacher = async (req, res) => {
    try {
        const { email, password } = req.body;
        const teacher = await Teacher.findOne({ email }).select('+password');

        if (teacher && (await teacher.comparePassword(password))) {
            const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET);
            res.json({ token });
        } else {
            res.status(401).json({ error: "Invalid Email or Password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ email }).select('+password');;

        if (student &&(await student.comparePassword(password))) {
            const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET);
            res.json({ token });
        } else{
            res.status(401).json({ error: "Invalid Email or Password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.logoutTeacher = (req, res) => {
    res.json({ success: true, message: 'Teacher logged out successfully' });
};

exports.logoutStudent = (req, res) => {
    res.json({ success: true, message: 'Student logged out successfully' });
};