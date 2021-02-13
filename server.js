const express = require("express");
const bodyParser = require('body-parser');

const app = express();
const port = 3000; 

const amountToSend = 1;

addressHistory = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/send', (req, res) => {
    var toAddress = req.body.address;
    console.log('received: ' + toAddress);

    if (addressHistory.includes(toAddress)) {
        res.send("Sorry, you've already gotten it :(");
        return;
    }


    addressHistory.push(req.body.address);

    res.send(`${amountToSend} SchruteBuck token sent to ${toAddress}!`);
});

app.listen(port, () => {
    console.log(`Listening on port ${3000}`);
});

