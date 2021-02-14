const express = require("express");
const bodyParser = require('body-parser');
const Stellar = require('stellar-sdk');
const { TransactionBuilder, Asset, Keypair, Networks, Operation } = require("stellar-sdk");

const app = express();
const port = 3000; 

var config;
var asset;
var stellarServer;
var stellarPassphrase;

addressHistory = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', async (req, res) => {
    var toAddress = req.body.address;
    console.log('received: ' + toAddress);

    if (addressHistory.includes(toAddress)) {
        res.send("Sorry, you've already gotten it :(");
        return;
    }

    var account = await stellarServer.loadAccount(config.distributor.public)
    var fee = await stellarServer.fetchBaseFee();

    try {
        var transaction = new TransactionBuilder(
            account, 
            { 
                fee, 
                networkPassphrase: stellarPassphrase
            }
        )
        .addOperation(Operation.payment({
            destination: toAddress,
            asset: asset,
            amount: config.amountToSend
        }))
        .setTimeout(30)
        .build();
    } catch(error) {
        console.log(error);
        res.send("Error with transaction, please email me at john+schrute@johnmahlon.me");
    }

    var pair = Stellar.Keypair.fromSecret(config.distributor.private);
    transaction.sign(pair);

    try {
        const result = await stellarServer.submitTransaction(
            transaction,
            {
                skipMemoRequiredCheck: true
            }
        );
        console.log(result)
        addressHistory.push(req.body.address);
        res.send(`${config.amountToSend} ${config.asset.name} tokens sent to ${toAddress}!`);

    } catch (err) {
        console.log(err);
        console.log(err.response.data.extras.result_codes);
        res.send("Error sending transaction :(");
    }
});

app.listen(port, () => {
    parseFile("PUBLIC.json");
    console.log(`Listening on port ${port}`);
});

function parseFile(name) {
    var fs = require('fs');
    config = JSON.parse(fs.readFileSync(name, 'utf8'));

    asset = new Asset(config.asset.name, config.asset.issuer);

    stellarServer = new Stellar.Server(
        config.public ? 
            "https://horizon.stellar.org" 
            : "https://horizon-testnet.stellar.org"
        );

    stellarPassphrase = config.public ? Networks.PUBLIC : Networks.TESTNET;
}

