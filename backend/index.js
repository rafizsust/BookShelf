const express = require('express');
const cors = require('cors');
const Jwt = require('jsonwebtoken');
const jwtKey = 'e-comm';

// Database models
const User = require('./db/user');
const Book = require('./db/book');

require('./db/config');

const app = express();
app.use(express.json());
app.use(cors());

// Check if the email is available
app.post('/emailCheck', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      res.json({ available: false });
    } else {
      res.json({ available: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User registration
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ error: 'Email is already in use' });
      return;
    }

    let user = new User({ name, email, password });
    let result = await user.save();
    result = result.toObject();
    delete result.pass;

    if (user) {
      Jwt.sign({ result }, jwtKey, { expiresIn: '2s' }, (err, token) => {
        res.send({ result, auth: token });
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User login
app.post('/login', async (req, res) => {
  if (req.body.email && req.body.password) {
    let user = await User.findOne(req.body).select('-password');
    
    if (user) {
      Jwt.sign({ user }, jwtKey, { expiresIn: '2h' }, (err, token) => {
        res.send({ user, auth: token });
      });
    } else {
      res.send({ result: 'no user found' });
    }
  } else {
    res.send({ result: 'no user found' });
  }
});

// Add a new Book
app.post('/add', verifyToken, async (req, res) => {
  let book = new Book(req.body);
  let result = await book.save();
  res.send(result);
});

// Get all Books
app.get('/', verifyToken, async (req, res) => {
  let books = await Book.find();
  
  if (books.length > 0) {
    res.send(books);
  } else {
    res.send({ result: 'No Book Found' });
  }
});

// Delete a Book
app.delete('/book/:id', verifyToken, async (req, res) => {
  let result = await Book.deleteOne({ _id: req.params.id });
  res.send(result);
});

// Get a single Book by ID
app.get('/book/:id', verifyToken, async (req, res) => {
  let result = await Book.findOne({ _id: req.params.id });
  res.send(result);
});

// Update a Book
app.put('/book/:id', verifyToken, async (req, res) => {
  let result = await Book.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  res.send(result);
});

// Search for Books by name, author, or genre
app.get('/search/:key', verifyToken, async (req, res) => {
  let result = await Book.find({
    $or: [
      { name: { $regex: req.params.key } },
      { author: { $regex: req.params.key } },
      { genre: { $regex: req.params.key } }
    ]
  });
  res.send(result);
});

// Token verification middleware
function verifyToken(req, res, next) {
  let token = req.headers['authorization'];

  if (token) {
    token = token.split(' ')[1];
    console.warn('middleware called', token);

    Jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        res.status(401).send({ result: 'please add valid token with header' });
      } else {
        next();
      }
    });
  } else {
    res.status(403).send({ result: 'please add token with header' });
  }
}

app.listen(2222);
