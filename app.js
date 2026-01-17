// ===== External libraries =====

// Express: used to create the server and define routes
const express = require('express');

/*
 http-errors:
 Used to handle HTTP errors in a cleaner way.

 Before:
   res.status(404).send("Not found");

 After:
   throw createError(404, "Not found");
*/
const createErrors = require('http-errors');

// CORS: allows requests from different domains
const cors = require('cors');

// ===== Internal imports (from src) =====

// API routes
const userRoute = require('./routes/user.route');
const categoryRoute = require('./routes/category.route');
const blogRoute = require('./routes/blog.route');

// constants
const app = express();

// Serve uploaded files as public static assets
app.use('/uploads', express.static('uploads'));

// Parse incoming JSON requests (API bodies)
app.use(express.json());

// Parse HTML form submissions
app.use(express.urlencoded({ extended: true }));

// Allow requests from any origin (open CORS policy)
app.use(cors({
    origin: '*'
}));

// routes
app.get('/', (req, res) => {
    res.send('Hello heroku');
});

app.use('/user', userRoute);
app.use('/category', categoryRoute);
app.use('/blog', blogRoute);

// Handles requests to non-existing routes (404 Not Found)
app.use(async (req, res, next) => {
    next(createErrors.NotFound('This route does not exist!'));
});


// Global handle errors
app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        err.status = 400;
    }
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message || 'Internal server error'
        }
    });
});

// exports
module.exports = app;