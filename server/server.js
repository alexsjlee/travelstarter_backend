const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const router = require('./router');
var { mongoose } = require('./db/mongoose');

var app = express();
const port = process.env.PORT || 3090;

app.use(bodyParser.json());
app.use(cors());

router(app);

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});