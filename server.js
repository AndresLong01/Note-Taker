const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
let PORT = process.env.PORT || 8080;

const notes = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        return res.json(JSON.parse(data));
    })
})
app.post("/api/notes", (req, res) => {
    req.body["id"] = notes.length + 1;
    let newNote = JSON.stringify(req.body);
    notes.push(newNote);
    fs.writeFile("./db/db.json", `[${notes}]`, "utf-8", (err) => {
        if (err) throw err;
        return res.json(req.body);
    })
})
app.delete("/api/notes/:id", (req, res) => {
    let deletion = req.params.id;
    for (let i = 0; i< notes.length; i++) {
        if(deletion === notes[i].id){
            notes.splice(deletion, 0);
            fs.writeFile("./db/db.json", `[${notes}]`, "utf-8", (err) => {
                if (err) throw err;
                return res.json(req.body);
            })
        }
    }
    res.json(req.body);
})
app.get("*", (req,data) => {
    data.sendFile(path.join(__dirname, "./public/index.html"));
});
app.listen(PORT, function(){
    console.log("I'm alive!")
})