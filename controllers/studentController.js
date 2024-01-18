const Class = require("../models/Class");
const Assignment = require("../models/Assignment");
const Student = require("../models/Student");
const { google } = require("googleapis");

exports.viewAttendance = async (req, res) => {
  try {
    const { classId, studentId } = req.params;

    const targetClass = await Class.findById(classId);

    if (!targetClass || !targetClass.spreadsheetLink) {
      return res.status(404).json({ error: "Class or linked spreadsheet not found" });
    }

    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json',
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    // Create client instance for auth
    const client = await auth.getClient();

    const sheets = google.sheets({ version: 'v4', auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: targetClass.spreadsheetLink,
      range: 'Attendance', // Change this to the actual sheet name
    });

    const rows = response.data.values;

    // Assuming the first row contains headers
    const headers = rows[0];

    // Find the student's row
    const studentRow = rows.find((row) => row[0] === studentId);

    if (!studentRow) {
      return res.status(404).json({ error: "Student not found in the attendance sheet" });
    }

    // Extract student name and roll
    const studentName = studentRow[1];
    const studentRoll = studentRow[0];

    const studentAttendance = headers.slice(2).map((date, index) => {
      return {
        date,
        status: studentRow[index + 2], // Adjusting index to match with the date
      };
    });

    const totalDays = headers.length - 2; // Exclude the "Student ID", "Name", and "Roll" columns
    const totalDaysPresent = studentAttendance.filter((day) => day.status === 'P').length;
    const totalDaysAbsent = studentAttendance.filter((day) => day.status === 'A').length;

    res.json({
      totalDays,
      totalDaysPresent,
      totalDaysAbsent,
      name: studentName,
      roll: studentRoll,
      attendance: studentAttendance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

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

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updatedInfo,
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.leaveClass = async (req, res) => {
  try {
    const { classId } = req.body;
    const studentId = req.student._id; // Assuming you have the student information in the request
    console.log(classId," ",studentId)

    const targetClass = await Class.findById(classId);

    if (!targetClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Find the target student
    const targetStudent = await Student.findById(studentId);

    if (!targetStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Remove the student from the class
    targetClass.students.pull(studentId);
    await targetClass.save();

    // Remove the class reference from the student document
    targetStudent.classes.pull(classId);
    await targetStudent.save();

    res.json({ success: true, message: "Student left the class successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};