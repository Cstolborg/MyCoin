const CryptoJS = require('crypto-js');
const SHA256 = require('crypto-js/sha256');
const {Transaction} = require("./transaction");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
const BigNumber = require('bignumber.js');



class Block {
    // Contains all logic concerning a single block
    constructor(timestamp, transactions, previousHash = '') {
      this.previousHash = previousHash;
      this.timestamp = timestamp;
      this.transactions = transactions;
      this.hash = this.calculateHash(this.timestamp);
    }
  
    calculateHash(timestamp=null) {
			if (timestamp == null) timestamp = this.timestamp
			let hash = SHA256(this.previousHash + timestamp + JSON.stringify(this.transactions)).toString();
			return hash
    }
		
    mineBlock(difficulty, balance) {
			// Mine a new block using a PoS method
			// At every timestamp, evaluate if hash is bigger than BalanceOverDiff
      const balanceOverDiff = new BigNumber(2).exponentiatedBy(256).times(balance).dividedBy(difficulty);
			let now = 0.

			while (true){
				now = Date.now()
        this.hash = this.calculateHash(now)
			  let decimalStakingHash = new BigNumber(this.hash, 16);
				
				if (balanceOverDiff.minus(decimalStakingHash).toNumber() >= 0){
					break
				}
      }
			this.timestamp = now
			console.log("Block mined: " + this.hash);
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
             typeof block.timestamp === 'number' 
    }
}

module.exports.Block = Block


let block = new Block(Date.now(), [], " ")
block.mineBlock(100000., 100.)

//block.mineBlock(1, balance=1000)