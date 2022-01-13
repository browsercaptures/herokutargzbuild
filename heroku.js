const fetch = require("node-fetch")
const fs = require("fs")

const pkg = require("./package.json");
const { getHeapSpaceStatistics } = require("v8");

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

function patch(endpoint, payload){
    return api(endpoint, "PATCH", payload)
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

function setConfig(name, configVars){
    patch(`apps/${name}/config-vars`, configVars).then(json => console.log(json))
}

function getApps(){
    return new Promise((resolve=>{
        get("apps").then(json => {
            if(require.main === module){
                console.log(json)
            }
            resolve(json)
        })
    }))
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

if (require.main !== module){
    console.log("heroku module")

    module.exports = {
        getApps
    }    
}else{
    console.log("heroku command")

    const heroku = pkg.heroku
    const command = argv._[0]
    delete argv._

    const appName = argv.name || heroku.appname
    const targzurl = argv.url || pkg.targzurl
    const config =  {}
    pkg.heroku.configvars.forEach(cv => config[cv]=process.env[cv])

    console.log(command, argv)

    if(command === "create"){
        createApp(appName)
    }else if(command === "del"){
        delApp(appName)
    }else if(command === "build"){
        buildApp(appName, targzurl)
    }else if(command === "schema"){
        getSchema()
    }else if(command === "setconfig"){
        setConfig(appName, config)
    }else if(command === "getapps"){
        getApps()
    }else{
        console.error("unknown command")
    }
}