require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes'); 

const app = express();

app.use(cors());
app.use(express.json()); 

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Global Service Marketplace API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});