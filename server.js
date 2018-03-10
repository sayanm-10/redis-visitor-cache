const express = require("express");
const app = express();
const user = require("./user.js");
//const UserData = require('./user_data.json');

app.get('/api/people/history', async (req, res) => {
    try {
        const history = await user.getHistory();
        if (typeof history !== "undefined" && history.length > 0) {
            res.status(200).json(history);
        } else {
            res.status(404).json({error: "History is written by victors!"});
        }
    } catch (err) {
        res.status(500);
        console.log("Error /api/people/history " + "\n" + err);
    }
});

app.get("/api/people/:id", async (req, res) => {
    try {
        const data = await user.getById(req.params.id);
        if (data.length > 0) {
            res.status(200).json(data[0]);
        } else {
            res.status(404).json({error: "Record Not Found"});
        }
    } catch (err) {
        // the server gave up!
        res.status(500).send();
        console.log("Error /api/people/:id" + '/n' + err);
    }
});

app.get('*', (req, res) => {
    res.status(404).json({error: "404 Page Not Found"});
});

app.listen(3000, () => {
    console.log("Routes available on http://localhost:3000");
});