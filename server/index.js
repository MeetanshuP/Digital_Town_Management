const express = require("express")
const app = express();

const PORT = 8000;

app.get('/',(req, res) => {
    return res.end(console.log("Hello World"));
})

app.listen(PORT, () => {
    console.log(`Server started and is running on port : ${PORT}`);
})