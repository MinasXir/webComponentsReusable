const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(express.static(__dirname + "/public"));

app.get(/.*page$/, (req, res) => {
    res.sendFile('./public/index.html', { root: __dirname });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
