const express = require('express');
const cors = require('cors');
const mainRouter = require("./routes/index");
const app = express();

app.use(cors());
app.use(express.json());
app.head('/api/v1/Health', (req, res) => {
    // Log the request if needed
    console.log('HEAD request received:', req.query);

    // Send a response without a body
    res.status(200).end();
});
app.get('/api/v1/check', (req, res) => {
    // Log the request if needed
    res.json({
        msg:"Running"
    })
});


app.use("/api/v1", mainRouter);

app.listen(3000, () => {
    console.log("Server running at 3000");
});
