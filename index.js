const express = require('express');
const morgan = require('morgan'); 
const cors = require('cors');
const path = require('path'); // <-- Add this line
const app = express();

app.use(cors());
app.use(morgan('tiny')); 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist'))); // <-- Update this line

let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(person => person.id === id);

  if (person) {
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

app.get('/info', (req, res) => {
  const persons_count = persons.length;
  const time = new Date();
  res.send(
    `<p>Phonebook has info for ${persons_count} people</p>
     <p>${time}</p>`
  );
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number || persons.find(person => person.name === body.name)) {
    return res.status(400).json({ error: 'name must be unique' });
  }

  const person = {
    id: Math.floor(Math.random() * 1e9).toString(),
    name: body.name,
    number: body.number
  };

  persons = persons.concat(person);
  res.json(person);
});

// Let frontend handle unknown routes (must be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})