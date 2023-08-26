const express = require('express')
const morgan = require('morgan')
const port = 8000

const app = express()
app.use(morgan('tiny'))

app.get('/', (req, res) => {
    res.status(200).json({message: 'hello world!'});
})

app.listen(port, () => {
    console.log(`Server is up and listening at port : ${port}`);
})