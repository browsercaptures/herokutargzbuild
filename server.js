const express = require('express')
const path = require("path")
const app = express()
const PORT = parseInt(process.env.PORT || "3000")
const createdAt = Date.now()

const nunjucks = require("nunjucks")

const { getApps, getAllApps, createApp, delApp, getAllTokens } = require("./heroku")

nunjucks.configure("views", {
  express: app
})

app.use(express.json())

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

app.post("/apps", (req,res)=>{
  getApps(req.body.token).then(apps => res.send(JSON.stringify(apps)))
})

app.get("/allapps", (req,res)=>{
  getAllApps().then(apps => res.send(JSON.stringify(apps)))
})

app.post("/createapp", (req,res)=>{
  createApp(req.body.name, req.body.token).then(result => res.send(JSON.stringify(result)))
})

app.post("/delapp", (req,res)=>{
  delApp(req.body.name, req.body.token).then(result => res.send(JSON.stringify(result)))
})

app.get("/getalltokens", (req,res)=>{
  res.send(JSON.stringify(getAllTokens()))
})

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
})
