const express = require("express");
const app = express();
const user = require("./user.js");
//const UserData = require('./user_data.json');

app.get("/api/people/:id", async (req, res) => {
    const data = user.getById(req.params.id);
    console.log(data);
    res.status(200).json(data);
});

app.get('/api/people/history', async (req, res) => {
    res.status(200);
});

app.get('*', (req, res) => {
    res.status(404).json({error: "404 Page Not Found"});
});

app.listen(3000, () => {
    console.log("Routes available on http://localhost:3000");
});