const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    dueDate: Date,
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }
    ]
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
