const connect = require("./db");
const express = require('express')
connect();
const app = express();
const cors = require('cors')

app.use(cors())
const port = 5000;
app.use(express.json());

app.use("/api/auth", require('./routes/auth'))
app.use("/api/note", require('./routes/note'))

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})