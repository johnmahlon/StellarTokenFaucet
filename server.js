const express = require("express");
const bodyParser = require('body-parser');
const Stellar = require('stellar-sdk');
const { TransactionBuilder, Asset, Keypair, Networks, Operation } = require("stellar-sdk");

const app = express();
const port = 3000; 

var distributorId;
var distributorPrivate;
var issuerId;
var asset;

const amountToSend = 1;

addressHistory = [];

stellarServer = new Stellar.Server("https://horizon-testnet.stellar.org");


app.use(bodyParser.urlencoded({ extended: true }));

app.post('/send', async (req, res) => {
    var toAddress = req.body.address;
    console.log('received: ' + toAddress);

    if (addressHistory.includes(toAddress)) {
        res.send("Sorry, you've already gotten it :(");
        return;
    }

    stellarServer.loadAccount(
        distributorId,
    ).then((account) => {
        var transaction = new TransactionBuilder(
            account, 
            { 
                fee: "100", 
                networkPassphrase: Networks.TESTNET
            }
        )
        .addOperation(Operation.payment({
            destination: toAddress,
            asset: asset,
            amount: "1"
        }))
        .setTimeout(30)
        .build();

        var pair = Stellar.Keypair.fromSecret(distributorPrivate);
        transaction.sign(pair);

        stellarServer
            .submitTransaction(
                transaction,
                {
                    skipMemoRequiredCheck: true
                }
            )
            .then(
                result => {
                    console.log(result)
                },

                reject => {
                    console.log(reject);
                }
            )
            .catch((err) => { console.log(err) });
        

        addressHistory.push(req.body.address);
        res.send(`${amountToSend} SchruteBuck token sent to ${toAddress}!`);
    })
    .catch( (err) => console.log(err));
});

app.listen(port, () => {
    parseFile("TEST.json");
    console.log(`Listening on port ${3000}`);
});

function parseFile(name) {
    var fs = require('fs');
    var data = JSON.parse(fs.readFileSync(name, 'utf8'));

    distributorId = data.distributor.public;
    distributorPrivate = data.distributor.private;

    asset = new Asset(data.asset.name, data.asset.issuer);
}

