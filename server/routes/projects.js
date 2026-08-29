const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

// Get all active projects (public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'All') filter.category = category;
    const projects = await Project.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all projects (admin)
router.get('/all', protect, async (req, res) => {
  try {
    const projects = await Project.find().sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single project by slug
router.get('/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create project
router.post('/', protect, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update project
router.put('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete project
router.delete('/:id', protect, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
