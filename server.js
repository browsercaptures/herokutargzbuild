const express = require('express')
const app = express()
const PORT = parseInt(process.env.PORT || "3000")

const nunjucks = require("nunjucks")

nunjucks.configure("views", {
  express: app
})

app.get('/', (req, res) => {
  res.render("index.html", {
    welcomeMsg: process.env.WELCOME_MESSAGE || "welcome",
    title: "Dummy App",
  })
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
