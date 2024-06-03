const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Set storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Set up a route for file upload
app.post('/upload', upload.array('files', 5), (req, res) => {
  try {
    // Access files in req.files array
    const files = req.files;

    // Process each file as needed (e.g., save to MongoDB, write to disk)
    const fileDetails = files.map(file => ({
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    }));

    res.json({ message: 'Files uploaded successfully', files: fileDetails });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
