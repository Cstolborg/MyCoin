const crypto = require('crypto');


class Block {
    constructor(timestamp, transactions, previousHash = '') {
      this.previousHash = previousHash;
      this.timestamp = timestamp;
      this.transactions = transactions;
      this.nonce = 0;
      this.hash = this.calculateHash();
    }
  
    calculateHash() {
      return crypto.createHash('sha256').update(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).digest('hex');
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
      return new Block(Date.parse('2017-01-01'), [], '0');
    }
  
    getLatestBlock() {
      return this.chain[this.chain.length - 1];
    }
    
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash
        newBlock.hash = newBlock.calculateHash()
        this.chain.push(newBlock)
    }
  
    isChainValid() {
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
  
        if (!currentBlock.hasValidTransactions()) {
          return false;
        }
  
        if (currentBlock.hash !== currentBlock.calculateHash()) {
          return false;
        }
      }
  
      return true;
    }
  }

let mycoin = new Blockchain()
mycoin.addBlock(new Block("07-11-2021", {amount: 4}))
mycoin.addBlock(new Block("07-11-2021", {amount: 10}))

console.log(JSON.stringify(mycoin, null, 4))
