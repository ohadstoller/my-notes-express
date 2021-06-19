require('dotenv').config()
const express = require('express')
const Note = require('./models/note')
const {nanoid} = require("nanoid");


const app = express()
app.use(express.json())

app.use(express.static('build'))

const cors = require('cors')
app.use(cors())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})


app.post('/api/notes', async (request, response, next) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({error: 'content missing'})
  }

  try {
    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date(),
    })

    const savedNote = await note.save()
    response.json(savedNote)

  } catch (e) {
    next(e)
  }


})

app.get('/api/notes/:id', async (request, response, next) => {
  try {
    const requestedNote = await Note.findById(request.params.id)
    if (requestedNote) {
      response.json(requestedNote)
    } else {
      response.status(404).end()
    }
  } catch (e) {
    next(e)
  }
})

app.delete('/api/notes/:id', async (request, response, next) => {
  try {
    const noteToDelete = await Note.findByIdAndRemove(request.params.id)
    if (noteToDelete) {
      return await response.status(204).end()
    } else {
      response.status(404).end()
    }

  } catch (e) {
    return next(e)

  }
})

app.put('/api/notes/:id', async (request, response, next) => {
  const body = request.body
  const note = {
    content: body.content,
    important: body.important,
  }
  try {
    const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, {new: true})
    response.json(updatedNote)
  } catch (e) {
    next(e)
  }

})


const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)