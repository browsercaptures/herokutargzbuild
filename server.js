const express = require("express");
const path = require("path");
const app = express();
const PORT = parseInt(process.env.PORT || "3000");
const createdAt = Date.now();

const nunjucks = require("nunjucks");

const buildConf = JSON.stringify(require("./buildconf.json"), null, 2);

const {
  getApps,
  getAllApps,
  createApp,
  delApp,
  getAllTokens,
  getLogs,
  getBuilds,
  buildApp,
  setConfig,
} = require("./heroku");

nunjucks.configure("views", {
  express: app,
});

app.use(express.json());

app.get("/", (req, res) => {
  res.render("index.html", {
    welcomeMsg: process.env.WELCOME_MESSAGE || "Welcome !",
    title: "Api Dummy App",
    buildConf,
    createdAt,
  });
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "favicon.ico"));
});

app.get("/vue", (req, res) => {
  res.sendFile(
    path.join(__dirname, "node_modules", "vue", "dist", "vue.global.prod.js")
  );
});

app.get("/createdat", (req, res) => {
  res.send(JSON.stringify(createdAt));
});

app.use(function (req, res, next) {
  req.isAdmin = false;
  if (req.body) {
    req.isAdmin = req.body.adminPass === process.env["ADMIN_PASS"];
  }
  next();
});

app.post("/getlogs", (req, res) => {
  if (!req.isAdmin) {
    res.send(JSON.stringify({ error: "Not Authorized" }));
    return;
  }

  getLogs(req.body.name, req.body.token).then((logs) =>
    res.send(JSON.stringify(logs))
  );
});

app.post("/getbuilds", (req, res) => {
  if (!req.isAdmin) {
    res.send(JSON.stringify({ error: "Not Authorized" }));
    return;
  }

  getBuilds(req.body.name, req.body.token).then((builds) =>
    res.send(JSON.stringify(builds))
  );
});

app.post("/apps", (req, res) => {
  getApps(req.body.token).then((apps) => res.send(JSON.stringify(apps)));
});

app.get("/allapps", (req, res) => {
  getAllApps().then((apps) => res.send(JSON.stringify(apps)));
});

app.post("/createapp", (req, res) => {
  if (!req.isAdmin) {
    res.send(JSON.stringify({ error: "Not Authorized" }));
    return;
  }

  createApp(req.body.name, req.body.token).then((result) =>
    res.send(JSON.stringify(result))
  );
});

app.post("/buildapp", (req, res) => {
  if (!req.isAdmin) {
    res.send(JSON.stringify({ error: "Not Authorized" }));
    return;
  }

  const name = req.body.name;
  const url = req.body.url;
  const token = req.body.token;

  setConfig(name, undefined, token).then((resultConfig) => {
    buildApp(name, url, token).then((resultBuild) =>
      res.send(JSON.stringify({ resultBuild, resultConfig }))
    );
  });
});

app.post("/delapp", (req, res) => {
  if (!req.isAdmin) {
    res.send(JSON.stringify({ error: "Not Authorized" }));
    return;
  }

  delApp(req.body.name, req.body.token).then((result) =>
    res.send(JSON.stringify(result))
  );
});

app.post("/getalltokens", (req, res) => {
  if (!req.isAdmin) {
    res.send(JSON.stringify({ error: "Not Authorized" }));
    return;
  }

  res.send(JSON.stringify(getAllTokens()));
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
