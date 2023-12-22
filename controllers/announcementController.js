// controllers/announcementController.js
const Announcement = require('../models/Announcement');
const Class = require('../models/Class');

exports.addAnnouncement = async (req, res) => {
    try {
        const { classId, title, content } = req.body;
        console.log('Received classId:', classId, title, content);
        const targetClass = await Class.findById(classId);

        if (!targetClass) {
            return res.status(404).json({ error: 'Class not found' });
        }

        const newAnnouncement = new Announcement({
            title,
            content,
            class: targetClass._id,
        });

        await newAnnouncement.save();
        targetClass.announcements.push(newAnnouncement);
        await targetClass.save();

        res.json(newAnnouncement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.viewAnnouncements = async (req, res) => {
    try {
        const { classId } = req.params;
        const targetClass = await Class.findById(classId).populate('announcements');

        if (!targetClass) {
            return res.status(404).json({ error: 'Class not found' });
        }

        res.json(targetClass.announcements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
