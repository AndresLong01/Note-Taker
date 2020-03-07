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
//Yeah, It's ugly and it doesn't make much sense. Let me run you through it Ryan
app.delete("/api/notes/:id", (req, res) => {
    //First I assigned the parameter as the ID of my JSON object
    let deletion = req.params.id;
    //Now, because my notes array is an array of stringified objects, and that sounds like a headache to 
    //turn into a JSON Object again... I'm just gonna read it from the file it cometh from.
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) throw err;
        //noteHistory is the data coming in from the parsed JSON file. The collective of notes hath been taketh.
        let noteHistory = JSON.parse(data);
        //looping to check for matching ids with the deletion id
        for (let i = 0; i< notes.length; i++) {
            //If there is a match, which there should always be
            if(deletion == noteHistory[i].id){
                //DELETE THAT FOREVER
                notes.splice(i, 1);
                //AND remake the database.
                fs.writeFile("./db/db.json", `[${notes}]`, "utf-8", (err) => {
                    if (err) throw err;
                    return;
                })
            }
        }
    })
    //I just put this here to have some response
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