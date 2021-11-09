const SHA256 = require('crypto-js/sha256')

class Transaction {
  constructor(toAddress, fromAddress, amount) {
    this.toAddress = toAddress
    this.fromAddress = fromAddress
    this.amount = amount
  }
}

class Block {
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
        this.nonce++;
        this.hash = this.calculateHash()
      }

      console.log("Block mined: " + this.hash)
    }
}

class Blockchain {
    constructor() {
      this.chain = [this.createGenesisBlock()];
      this.difficulty = 2;
      this.pendingTransactions = [];
      this.miningReward = 100;
    }
  
    createGenesisBlock() {
      return new Block(Date.parse('2021-09-11'), [], '0');
    }
  
    getLatestBlock() {
      return this.chain[this.chain.length - 1];
    }
    
    minePendingTransaction(minerRewardAdress){
      // Mine all pending transactions and add them to a new block
      let block = new Block(Date.now(), this.pendingTransactions);
      block.mineBlock(this.difficulty);

      this.chain.push(block);

      this.pendingTransactions = [
        new Transaction(null, minerRewardAdress, this.miningReward)
      ];
    }

    createTransaction(transaction){
      this.pendingTransactions.push(transaction);
    }
  
    getBalanceOfAdress(address){
      let balance = 0.
      for (const block of this.chain){
        for (const trans of block.transactions){
          if (trans.fromAdress === address){
            balance -= trans.amount
          }
        
          if (trans.toAdress === address){
            balance += trans.amount
          }
        }
      }

      return "Balance of "+address + " is " + balance
    }

    isChainValid(){
      // Check if the Genesis block hasn't been tampered with by comparing
      // the output of createGenesisBlock with the first block on our chain
      const realGenesis = JSON.stringify(this.createGenesisBlock());
  
      if (realGenesis !== JSON.stringify(this.chain[0])) {
        return false;
      }
  
      // Check the remaining blocks on the chain to see if there hashes and
      // signatures are correct
      for (let i = 1; i < this.chain.length; i++) {
        const currentBlock = this.chain[i];
        const previousBlock = this.chain[i - 1];
  
        if (previousBlock.hash !== currentBlock.previousHash) {
          return false;
        }
        if (currentBlock.hash !== currentBlock.calculateHash()) {
          return false;
        }
      }
  
      return true;
    }
  }

module.exports.Transaction = Transaction
module.exports.Blockchain = Blockchain