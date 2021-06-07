// Require Dependencies
const express = require("express");
const fs = require("fs");
const path = require('path');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Setup data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const mainDir = path.join(__dirname, "/public");
app.get('/', (req, res) => res.sendFile(path.join(mainDir , 'index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(mainDir , 'notes.html')));
app.get('/api/notes', (req, res) => res.sendFile(__dirname, '/db/db.json'));

// Displays notes as JSON object 
let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
app.get('/api/notes/', function(req, res) {
    res.json(savedNotes);
});
app.get('/api/notes/:id', function(req, res) {
    res.json(savedNotes[Number(req.params.id)]);
});

// Read/Write Files w/fs
app.post('/api/notes', (req, res) => {
    let newNote = req.body;
    let uniqueID = (savedNotes.length).toString();
    newNote.id = uniqueID;
    savedNotes.push(newNote);

    console.log(savedNotes);

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes), function(err) {
        if (err) {
            throw err;
        }
    });
    console.log("Your note has been saved to db.json. Content: ", newNote);
    res.json(savedNotes);
});

app.delete("/api/notes/:id", function(req, res) {
    let noteID = req.params.id;
    let newID = 0;
    
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    })
    
    for (currNote of savedNotes) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes), function(err) {
        if (err) {
            throw err;
        }
    });
    console.log(`Note ID ${newID} has been deleted!`);    
    res.json(savedNotes);
})

// Setup listener
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});  

