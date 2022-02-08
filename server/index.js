const express = require("express");
const bodyParser = require("body-parser");
const Web3 = require("web3");
const provider = new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'); // replace with mainnet
const web3 = new Web3(provider);

acc = require("./account.json");

const PORT = 3001;

const app = express();
app.use(bodyParser.json());

app.post('/replenish-balance', async function(request, response) {
    try
    {
        var replenishAddress = request.body.replenishAddress;
        let amount = request.body.tokenAmount;

        var balance = await web3.eth.getBalance(acc.address);
        let weiAmount = web3.utils.toWei(amount.toString(), "ether");
    
        if(weiAmount > balance) {
            response.send('Not enough money to transfer');
            return;
        }
    
        var gas  = await web3.eth.estimateGas({from: acc.address, to: replenishAddress, amount: weiAmount})
    
        const transaction = {
         'to': replenishAddress,
         'value': weiAmount,
         'gas': gas
        };
    
        const signedTx = await web3.eth.accounts.signTransaction(transaction, acc.privateKey);
        console.log(signedTx);
    
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
            if (!error) {
                response.send("The hash of your transaction is: " + hash);
                return;
            } else {
                response.send("Something went wrong while submitting your transaction:" + error);
                return;
            }
        });
    }
    catch (err)
    {
        response.send("An error occured: " + err.message);
        return;
    }
});

app.listen(PORT, () => {});