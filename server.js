const express = require("express");
const app = express();
const UserData = require('./user_data.json');

app.get("/api/people/:id", async (req, res) => {
    
});

app.get('/api/people/history', async (req, res) => {
    res.status(200).json(UserData);
});

app.get('*', (req, res) => {
    res.status(404).json({error: "404 Page Not Found"});
});

app.listen(3000, () => {
    console.log("Routes available on http://localhost:3000");
});