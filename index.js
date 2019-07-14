const express = require('express');
const app = express();
const mongoose = require('mongoose');

//Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
//DB
const db = require('./config/keys').MongoURI;

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));





// Middlewares
app.use(express.json());



//Route Middlewares

app.use('/api/user', authRoute)
app.use('/api/posts', postRoute);
app.listen(5000, () => console.log('Server up and running on 5000'));
