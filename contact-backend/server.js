// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const csvtojson = require('csvtojson');
const xlsx = require('xlsx');
const Contact = require('./models/contact');

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect('mongodb://localhost:27017/contactApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

app.post('/api/import-contacts', upload.single('file'), async (req, res) => {
  try {
    let contacts;
    const fileBuffer = req.file.buffer;

    if (req.file.originalname.endsWith('.csv')) {
      contacts = await csvtojson().fromString(fileBuffer.toString());
    } else if (req.file.originalname.endsWith('.xlsx')) {
      const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      contacts = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else {
      throw new Error('Invalid file format');
    }

    await Contact.insertMany(contacts);

    res.status(201).json({ message: 'Contacts imported successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
