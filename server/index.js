const express = require("express")
const app = express();

const PORT = 8000;

app.get('/',(req, res) => {
    return res.send("Home Page");
})

app.get('/events', (req, res) => {
    return res.send("Events page");
})

app.get('/marketplace', (req, res) => {
    res.send("Market Place");
})

app.listen(PORT, () => {
    console.log(`Server started and is running on port : ${PORT}`);
})