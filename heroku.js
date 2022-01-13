const fetch = require("node-fetch")
const fs = require("fs")

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

function getSchema(){
    get("schema").then(json => fs.writeFileSync("schema.json", JSON.stringify(json, null, 2)))  
}

function createApp(name){
    post("apps", {name}).then(json => console.log(json))  
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
