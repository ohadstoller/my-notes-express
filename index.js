const express = require('express')
const app = express()
app.use(express.json())

const { nanoid } = require("nanoid");



let notes = [
  {
    id: nanoid(),
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: nanoid(),
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: nanoid(),
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})


app.get('/api/notes/:id', (request, res) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  note ? res.json(note) : res.status(404).end()
})

app.post('/api/notes', (req, res) => {
  const note = req.body
  console.log(note)
  res.json(note)
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)
  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})