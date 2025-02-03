const mongoose = require('mongoose');

const codeBlockSchema = new mongoose.Schema({
    name: String,
    code: String,
    solution: String,
});

module.exports = mongoose.model('CodeBlock', codeBlockSchema);