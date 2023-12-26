const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Assignment = require('../models/Assignment');
const Student = require('../models/Student');

exports.searchStudents = async (req, res) => {
    try {
        const { name, rollNo, semester, branch } = req.query;

        // Build the search criteria
        const searchCriteria = {};
        if (name) searchCriteria.name = { $regex: new RegExp(name, 'i') }; // Case-insensitive regex
        if (rollNo) searchCriteria.rollNo = rollNo;
        if (semester) searchCriteria.semester = semester;
        if (branch) searchCriteria.branch = branch;

        const projection = { _id: 0 };

        const students = await Student.find(searchCriteria).select(projection);

        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.createClass = async (req, res) => {
    try {
        const { name, semester, section, subject, subjectCode } = req.body;
        const teacher = await Teacher.findOne({ name });

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        const newClass = new Class({
            semester,
            section,
            teacher: teacher._id,
            subject,
            subjectCode,
        });

        await newClass.save();
        teacher.classes.push(newClass);
        await teacher.save();

        res.json(newClass);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.addAssignment = async (req, res) => {
    try {
        const { classId, title, description, dueDate } = req.body;
        const targetClass = await Class.findById(classId);

        if (!targetClass) {
            return res.status(404).json({ error: 'Class not found' });
        }

        const newAssignment = new Assignment({
            title,
            description,
            dueDate,
            class: targetClass._id,
        });

        await newAssignment.save();
        targetClass.assignments.push(newAssignment);
        await targetClass.save();

        res.json(newAssignment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.addStudentsToClass = async (req, res) => {
    try {
        const { classId, studentNames } = req.body;

        // Find the target class
        const targetClass = await Class.findById(classId);

        if (!targetClass) {
            return res.status(404).json({ error: 'Class not found' });
        }

        // Find the students
        const students = await Student.find({ name: { $in: studentNames } });

        if (!students || students.length === 0) {
            return res.status(404).json({ error: 'Students not found' });
        }

        // Filter out already existing students in the class
        const newStudents = students.filter(student => !targetClass.students.includes(student._id));

        // Add the new students to the class
        targetClass.students.push(...newStudents);
        await targetClass.save();

        // Update the class reference in each new student document
        for (const newStudent of newStudents) {
            newStudent.classes.push(targetClass._id);
            await newStudent.save();
        }

        res.json(targetClass);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.viewClasses = async (req, res) => {
    try {
        const { name } = req.query;
        const teacher = await Teacher.findOne({ name }).populate('classes');

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        res.json(teacher.classes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.viewAssignments = async (req, res) => {
    try {
        const { classId } = req.params;
        const targetClass = await Class.findById(classId).populate('assignments');

        if (!targetClass) {
            return res.status(404).json({ error: 'Class not found' });
        }

        res.json(targetClass.assignments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
