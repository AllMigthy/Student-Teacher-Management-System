const Parent = require('../models/Parent');

exports.viewChildInfo = async (req, res) => {
    try {
        const parentId = req.parent._id;
        const parent = await Parent.findById(parentId).populate({
            path: 'students',
            populate: [
                { path: 'classes', select: 'semester section subject subjectCode' },
                {
                    path: 'classes',
                    populate: [
                        { path: 'assignments' },
                        { path: 'announcements' },
                    ],
                },
                { path: 'parents', model: 'Parent' },
            ],
        });

        // Assuming a parent has multiple children
        const children = parent.students;

        res.json(children);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

