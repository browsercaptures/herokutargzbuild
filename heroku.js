const fetch = require("node-fetch")
const fs = require("fs")

const pkg = require("./package.json")

const argv = require('minimist')(process.argv.slice(2));

const API_BASE_URL = "https://api.heroku.com"

function api(endpoint, method, payload){
    return new Promise((resolve, reject) => {
        fetch(`${API_BASE_URL}/${endpoint}`, {
            method,
            headers:{
                Authorization: `Bearer ${process.env.HEROKU_TOKEN}`,
                Accept: "application/vnd.heroku+json; version=3",
                "Content-Type": "application/json",
            },
            body: payload ? JSON.stringify(payload) : undefined
        }).then(
            resp => resp.json().then(
                json => resolve(json),
                err => {
                    console.error(err)
                    reject(err)
                }
            ),
            err => {
                console.error(err)
                reject(err)
            }
        )
    })    
}

function get(endpoint, payload){
    return api(endpoint, "GET", payload)
}

function post(endpoint, payload){
    return api(endpoint, "POST", payload)
}

function del(endpoint, payload){
    return api(endpoint, "DELETE", payload)
}

function getSchema(){
    get("schema").then(json => fs.writeFileSync("schema.json", JSON.stringify(json, null, 2)))  
}

function createApp(name){
    post("apps", {name}).then(json => console.log(json))  
}

function delApp(name){
    del(`apps/${name}`).then(json => console.log(json))
}

function buildApp(name, url){
    post(`apps/${name}/builds`, {
        "source_blob": {
            "checksum": null,
            url,
            "version": null
        }
    }).then(json => console.log(json))    
}

console.log(argv)

const heroku = pkg.heroku
const command = argv._[0]

const appName = argv.name || heroku.appname
const targzurl = argv.url || pkg.targzurl

if(command === "create"){
    createApp(appName)
}else if(command === "del"){
    delApp(appName)
}else if(command === "build"){
    buildApp(appName, targzurl)
}else if(command === "schema"){
    getSchema()
}
