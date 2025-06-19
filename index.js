require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const app = express();
const Person = require("./models/person");

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

app.get("/api/persons", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "name and number are required" });
  }

  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        person.name = name;
        person.number = number;
        return person.save();
      } else {
        res.status(404).end();
      }
    })
    .then((updatedPerson) => {
      if (updatedPerson) res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res) => {
  Person.countDocuments({}).then((count) => {
    const time = new Date();
    res.send(
      `<p>Phonebook has info for ${count} people</p>
       <p>${time}</p>`
    );
  });
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name and number are required" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
