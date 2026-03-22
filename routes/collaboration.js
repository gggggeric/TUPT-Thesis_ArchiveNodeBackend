const express = require('express');
const router = express.Router();
const Collaboration = require('../models/Collaboration');
const Thesis = require('../models/Thesis');
const auth = require('../middleware/auth');

// @route   POST /collaboration
// @desc    Create a new collaboration request
router.post('/', auth, async (req, res) => {
    try {
        const { thesisId, message } = req.body;

        if (!thesisId || !message) {
            return res.status(400).json({ success: false, message: 'Thesis ID and message are required' });
        }

        const thesis = await Thesis.findById(thesisId).populate('createdBy');
        if (!thesis) {
            return res.status(404).json({ success: false, message: 'Thesis not found' });
        }

        // Check if the requester is the owner
        if (thesis.createdBy._id.toString() === req.user.toString()) {
            return res.status(400).json({ success: false, message: 'You cannot request collaboration on your own thesis' });
        }

        // Check if a request already exists
        const existingRequest = await Collaboration.findOne({
            alumni: req.user,
            thesis: thesisId
        });

        if (existingRequest) {
            return res.status(400).json({ success: false, message: 'Collaboration request already sent for this thesis' });
        }

        const newCollaboration = new Collaboration({
            alumni: req.user,
            undergrad: thesis.createdBy._id,
            thesis: thesisId,
            message
        });

        await newCollaboration.save();
        res.status(201).json({ success: true, data: newCollaboration });

    } catch (err) {
        console.error('Collaboration request error:', err);
        res.status(500).json({ success: false, message: 'Error creating collaboration request', error: err.message });
    }
});

// @route   GET /collaboration/my-requests
// @desc    Get requests made by the current user (Alumni)
router.get('/my-requests', auth, async (req, res) => {
    try {
        const requests = await Collaboration.find({ alumni: req.user })
            .populate('thesis', 'title id')
            .populate('undergrad', 'name profilePhoto')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, data: requests });
    } catch (err) {
        console.error('Fetch requests error:', err);
        res.status(500).json({ success: false, message: 'Error fetching requests', error: err.message });
    }
});

// @route   GET /collaboration/incoming
// @desc    Get requests received by the current user (Undergrad)
router.get('/incoming', auth, async (req, res) => {
    try {
        const requests = await Collaboration.find({ undergrad: req.user })
            .populate('thesis', 'title id')
            .populate('alumni', 'name profilePhoto isGraduate')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, data: requests });
    } catch (err) {
        console.error('Fetch incoming requests error:', err);
        res.status(500).json({ success: false, message: 'Error fetching incoming requests', error: err.message });
    }
});

// @route   PATCH /collaboration/:id
// @desc    Update request status (Accept/Decline)
router.patch('/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['accepted', 'declined'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const request = await Collaboration.findOne({ _id: req.params.id, undergrad: req.user });
        if (!request) {
            return res.status(404).json({ success: false, message: 'Collaboration request not found or unauthorized' });
        }

        request.status = status;
        await request.save();

        res.json({ success: true, data: request });
    } catch (err) {
        console.error('Update request error:', err);
        res.status(500).json({ success: false, message: 'Error updating request', error: err.message });
    }
});

module.exports = router;
