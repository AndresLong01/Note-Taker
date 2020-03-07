//Importing all necessary fragments
const express = require("express");
const path = require("path");
const fs = require("fs");

//Calling my express function app and adjusting the port for heroku
const app = express();
let PORT = process.env.PORT || 8080;

//Initializing an array to store information locally
let notes = [];

//Using static to be able to pring the development html with no issue
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//Routing for Heroku
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});
//Getting all the information to log into the screen as a JSON format
app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        return res.json(JSON.parse(data));
    })
})
//Adding New Notes. Initializing the notes aa an empty []
app.post("/api/notes", (req, res) => {
    req.body["id"] = notes.length + 1;
    let newNote = JSON.stringify(req.body);
    notes.push(newNote);
    fs.writeFile("./db/db.json", `[${notes}]`, "utf-8", (err) => {
        if (err) throw err;
        return res.json(req.body);
    })
})
// Hopefully deleting stuff :c
app.delete("/api/notes/:id", (req, res) => {
    let deletion = req.params.id;
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) throw err;
        let savedNotes = JSON.parse(data);
        for (let i = 0; i< notes.length; i++) {
            console.log(deletion, savedNotes[i].id, i)
            if(deletion == savedNotes[i].id){
                notes.splice(i, 1);
                fs.writeFile("./db/db.json", `[${notes}]`, "utf-8", (err) => {
                    if (err) throw err;
                    return;
                })
            }
        }
    })
    res.end();
})

//Wildcard Identifier
app.get("*", (req,data) => {
    data.sendFile(path.join(__dirname, "./public/index.html"));
});
//HEY! LISTEN!
app.listen(PORT, function(){
    console.log("I'm alive!")
})