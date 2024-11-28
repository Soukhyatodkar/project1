const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// File storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Schema and model for documents
const documentSchema = new mongoose.Schema({
    title: String,
    description: String,
    tags: [String],
    filePath: String,
});

const Document = mongoose.model('Document', documentSchema);

// Routes
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        const newDoc = new Document({
            title,
            description,
            tags: tags.split(','),
            filePath: req.file.path,
        });
        await newDoc.save();
        res.status(201).json({ message: 'File uploaded successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const documents = await Document.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } },
            ],
        });
        res.status(200).json(documents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
