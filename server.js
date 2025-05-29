const express = require('express');
const eventRoutes = require('./routes/events');
// const { connectDB } = require('./db/connection'); // Will be used later

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Mount routes
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
    res.send('WhatsApp Bot Backend is running!');
});

// connectDB().then(() => { // DB connection will be activated in a later step
//     app.listen(PORT, () => {
//         console.log(`Server is running on port ${PORT}`);
//     });
// }).catch(err => {
//     console.error("Failed to connect to DB", err);
//     process.exit(1);
// });

// For now, start server without DB connection
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}. DB connection pending.`);
});
