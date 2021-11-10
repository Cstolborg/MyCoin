const {Transaction, Blockchain} = require("./blockchain");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Private key goes here
const myKey = ec.keyFromPrivate('c8bf4b6354e62661e3faa70b6dc956ce6924dbdb7c27b50b3927023b53e28129');

// From that we can calculate your public key (which doubles as your wallet address)
const myWalletAddress = myKey.getPublic('hex');

// Create new instance of Blockchain class
const myCoin = new Blockchain();

// Mine first block
myCoin.minePendingTransactions(myWalletAddress);
myCoin.minePendingTransactions(myWalletAddress);

// Create a transaction & sign it with your key
const tx1 = new Transaction(myWalletAddress, 'address2', 100);
tx1.signTransaction(myKey);
myCoin.addTransaction(tx1);

console.log(myCoin.getBalanceOfAddress(myWalletAddress))