const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Or enable it for specific origins
app.use(cors({
  origin: 'http://localhost:5173'
}));

// Define a test route to make sure your server is working
app.get('/', (req, res) => {
    res.send('Othello Game API');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
