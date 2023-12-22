const Class = require("../models/Class");
const Assignment = require("../models/Assignment");
const Student = require("../models/Student");

exports.submitAssignment = async (req, res) => {
    try {
        const { studentName, assignmentId } = req.body;
        const student = await Student.findOne({ name: studentName });
        const assignment = await Assignment.findById(assignmentId);

        if (!student || !assignment) {
            return res.status(404).json({ error: "Student or Assignment not found" });
        }

        // Ensure the 'students' array is initialized
        if (!assignment.students) {
            assignment.students = [];
        }

        assignment.students.push(student);
        await assignment.save();

        // Ensure the 'assignments' array is initialized
        if (!student.assignments) {
            student.assignments = [];
        }

        student.assignments.push(assignment);
        await student.save();

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.viewAssignments = async (req, res) => {
  try {
    const { classId } = req.params;
    const targetClass = await Class.findById(classId).populate("assignments");
    if (!targetClass) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.json(targetClass.assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateStudentInfo = async (req, res) => {
    try {
        const { name, semester, rollNo, branch } = req.body;
        const studentId = req.student._id;

        const updatedInfo = {};
        if (name) updatedInfo.name = name;
        if (semester) updatedInfo.semester = semester;
        if (rollNo) updatedInfo.rollNo = rollNo;
        if (branch) updatedInfo.branch = branch;

        const updatedStudent = await Student.findByIdAndUpdate(studentId, updatedInfo, { new: true });

        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(updatedStudent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};