const express = require("express");
require("dotenv").config(); 
const Note = require("./models/note")
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static("dist"));
const mongoose = require("mongoose");

const url = process.env.MONGODB_URL;

mongoose.set("strictQuery", false);

mongoose.connect(url).then(result=>{
  console.log("Connected to mongoDB");
}).catch(error=>{
  console.log("error connecting to MongoDB:",error.message);
})


let notes = [
  { id: 1, content: "HTML is easy", important: true },
  { id: 2, content: "Browser can execute only JavaScript", important: false },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
  { id: 4, content: "JavaScript is awesome", important: true },
  {
    id: 5,
    content: "Node.js is a powerful runtime environment",
    important: false,
  },
];

app.get("/api/notes/", (request, response) => {
  Note.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log("id:", typeof id);
  const note = notes.find((note) => note.id === id);
  console.log(note);
  if (note != undefined) {
    response.json(note);
  } else {
    response.statusMessage = "Not found";
    response.status(404).end();
  }
});

app.use(express.json());

const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
  return maxId + 1;
};

app.post("/api/notes", (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({
      error: "content is missing",
    });
  }

  const note = {
    id: generateId(),
    content: body.content,
    important: Boolean(body.important) || false,
  };

  notes = notes.concat(note);

  response.json(note);
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.filter((note) => (note.id = id));
  res.status(204).end();
});

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
