const SHA256 = require('crypto-js/sha256')
const {Transaction} = require("./transaction");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");




class Block {
    // Contains all logic concerning a single block
    constructor(timestamp, transactions, previousHash = '') {
      this.previousHash = previousHash;
      this.timestamp = timestamp;
      this.transactions = transactions;
      this.nonce = 0;
      this.hash = this.calculateHash();
    }
  
    calculateHash() {
      return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
      while (this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")){
        this.nonce++; // increment nonce to ensure that the hash is different for every loop
        this.hash = this.calculateHash()
      }

      console.log("Block mined: " + this.hash)
    }

    hasValidTransaction(){
      // check all transactions are valid
      for (const tx of this.transactions){
        if(!tx.isValid()) {
          return false;
        }
      }
      
      return true;
    }

    isValidBlockStructure(){
      return typeof block.previousHash === 'string' &&
             typeof block.hash === 'string' &&
             typeof block.timestamp === 'string'  
    }
}

module.exports.Block = Block