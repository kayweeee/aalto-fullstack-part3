// IMPORTS
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

// MIDDLEWARES
app.use(express.json());
morgan.token("post-body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :post-body"
  )
);
app.use(cors());
app.use(express.static("dist"));

// DATA
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const num_persons = persons.length;
  const date = new Date();
  res.send(
    `<p>Phonebook has information for ${num_persons} people.</p><p>${date.toString()}</p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const getRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({ error: "missing fields" });
  }

  if (persons.find((person) => person.name === body.name)) {
    return res
      .status(400)
      .json({ error: "person already exists in the phonebook" });
  }

  const person = {
    id: getRandomNumber(1, 1000),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.json(person);
});

// PORT
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
