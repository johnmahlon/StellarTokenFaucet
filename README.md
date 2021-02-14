# Stellar Token Faucet

A Node.js app that provides the backend for a faucet

You will need to provide a json file in the format:

```json
{
    "asset": {
        "issuer": "<Issuer public key>",
        "name": "<Asset Name (i.e. ABC, SomeToken)>"
    },

    "distributor": {
        "public": "<Distributor public key",
        "private": "<Distributor private key"
    },

    "public": <true or false>,

    "amountToSend": "100"
}
```
and then, provide the name of the file to the `parseFile()` function in `app.listen()`, pass in that file name. Also, change the endpoint field if you want to run on the main net and change the amount to send to whatever you want your faucet to give out.




