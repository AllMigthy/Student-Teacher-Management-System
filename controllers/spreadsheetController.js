const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
const fs = require('fs');
const Class = require('../models/Class');

exports.linkSpreadsheet = async (req, res) => {
  try {
    const { classId } = req.body;
    const targetClass = await Class.findById(classId);

    if (!targetClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Load the service account key
    const serviceAccountFile = 'serviceAccountKey.json';
    const serviceAccountKey = JSON.parse(fs.readFileSync(serviceAccountFile));

    // Set up JWT credentials
    const credentials = new JWT({
      email: serviceAccountKey.client_email,
      key: serviceAccountKey.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Authorize the client
    await credentials.authorize();

    // Create a new spreadsheet
    const sheets = google.sheets({ version: 'v4', auth: credentials });
    const spreadsheet = await sheets.spreadsheets.create({
      resource: {
        properties: {
          title: `Class ${classId} Spreadsheet`, // Modify as needed
        },
      },
    });

    // Store the spreadsheet link in the target class in your database
    targetClass.spreadsheetUrl = spreadsheet.data.spreadsheetUrl;
    await targetClass.save();

    res.json({ message: 'Spreadsheet created and linked successfully', spreadsheetUrl: spreadsheet.data.spreadsheetUrl });
  } catch (error) {
    console.error('Error creating and linking spreadsheet:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Function to fetch attendance data from the linked spreadsheet
exports.fetchAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const targetClass = await Class.findById(classId);

    if (!targetClass || !targetClass.spreadsheetId) {
      return res.status(404).json({ error: 'Class or spreadsheet not found' });
    }

    // Use the spreadsheetId to fetch attendance data
    const spreadsheet = new GoogleSpreadsheet(targetClass.spreadsheetId);

    // ... implement fetching data from the spreadsheet
    // For simplicity, let's assume you have a sheet named 'Attendance'
    await spreadsheet.loadInfo();
    const sheet = spreadsheet.sheetsByTitle['Attendance'];
    const rows = await sheet.getRows();

    // Sample response
    const attendanceData = rows.map(row => row._rawData);
    res.json(attendanceData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
