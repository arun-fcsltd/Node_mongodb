const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/mongo');
const authMiddleware = require('./middleware/authMiddleware');
const routes = require('./routes');
const authRoutes = require('./routes/authRoutes');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// app.use('/', (req, res) => res.send('Welcome to the Complaints Resolution Resource Management System'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/public', express.static('storage/public'));
app.use('/api/auth', authRoutes);
app.use('/api', authMiddleware, routes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
