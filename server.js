const express = require('express')
const app = express()
const PORT = parseInt(process.env.PORT || "3000")

app.get('/', (req, res) => {
  res.send(process.env.WELCOME_MESSAGE || "welcome")
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
