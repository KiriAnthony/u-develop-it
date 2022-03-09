// create the express connection
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

// add express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// GET test to test express connection
// app.get('/', (req, res) => {
//     res.json({
//         message: 'Hello World'
//     });
// }); // run by npm start after adding start:node server.js to package.json

// default response for any other request (Not Found)
// this route overrides all others (Keep as last)
app.use((req, res) => {
    res.status(404).end();
});

// function to start express.js server on port 3001 (bottom of file)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});