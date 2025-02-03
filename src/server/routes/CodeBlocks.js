const express = require('express');
const CodeBlock = require('./models/CodeBlock');
const router = express.Router();

// Get a code block by ID
router.get('/:id', async (req, res) => {
    const codeBlock = await CodeBlock.findById(req.params.id);
    res.json(codeBlock);
});

module.exports = router;