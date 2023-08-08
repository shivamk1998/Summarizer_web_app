const dotenv = require("dotenv").config();
const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const multer = require("multer");

const app = express();
const port = 3002;

const OPEN_API_KEY = process.env.OPEN_API_KEY;

const model = "whisper-1";

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });



app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/transcribe", upload.single("file"), (req, res) => {
 
  const filePath = req.file.path;

  const formData = new FormData();
  formData.append("model", model);
  formData.append("file", fs.createReadStream(filePath));

  axios
    .post("https://api.openai.com/v1/audio/transcriptions", formData, {
      headers: {
        Authorization: `Bearer ${OPEN_API_KEY}`,
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      },
    })
    .then((response) => {
      const transcriptions = response.data;

      if (transcriptions) {
        const transcript = transcriptions.text;

        res.json({ transcription: transcript });
      } else {
        res.status(404).json({ error: "No transcriptions found." });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred during transcription." });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
