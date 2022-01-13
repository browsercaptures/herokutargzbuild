const express = require('express')
const path = require("path")
const app = express()
const PORT = parseInt(process.env.PORT || "3000")
const createdAt = Date.now()

const nunjucks = require("nunjucks")

const { getApps } = require("./heroku")

nunjucks.configure("views", {
  express: app
})

app.get('/', (req, res) => {
  res.render("index.html", {
    welcomeMsg: process.env.WELCOME_MESSAGE || "Welcome !",
    title: "Api Dummy App",
    createdAt,
  })
})

app.get("/vue", (req,res)=>{
  res.sendFile(path.join(__dirname, "node_modules", "vue", "dist", "vue.global.prod.js"))
})

app.get("/createdat", (req,res)=>{
  res.send(JSON.stringify(createdAt))
})

app.get("/apps", (req,res)=>{
  getApps().then(apps => res.send(JSON.stringify(apps)))
})

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
})
