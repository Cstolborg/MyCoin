const SHA256 = require('crypto-js/sha256')
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress
    this.toAddress = toAddress
    this.amount = amount
  }

  calculateHash(){
    return SHA256(this.toAddress, this.fromAddress, this.amount).toString();
  }

  signTransaction(signingKey){
    if (signingKey.getPublic('hex') !== this.fromAddress){
      throw new Error("Your signing key does not match your wallet");
    }

    // Calculate hash of transaction and sign it with key
    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, "base64");

    this.signature = sig.toDER('hex');
  }

  isValid(){
    if (this.fromAddress === null) return true

    if (!this.signature || this.signature.length === 0){
      throw new Error("No signature")
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
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

    hasValidTransaction(){
      for (const tx of this.transactions){
        if(!tx.isValid()) {
          return false;
        }
      }
      
      return true;
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
    
    minePendingTransactions(minerRewardAddress){
      // Mine all pending transactions and add them to a new block
      let block = new Block(Date.now(), this.pendingTransactions);
      block.mineBlock(this.difficulty);

      this.chain.push(block);

      // reset pending transactions and give block reward to miner in next block
      // Important to delay block rewards for security reasons
      this.pendingTransactions = [
        new Transaction(null, minerRewardAddress, this.miningReward)
      ];
    }

    addTransaction(transaction){
      if (!transaction.fromAddress || !transaction.toAddress){
        throw new Error("Transaction must have a to- and from address")
      }

      if (!transaction.isValid()){
        throw new Error("Transaction not valid")
      }

      this.pendingTransactions.push(transaction);
    }
  
    getBalanceOfAddress(address){
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

        if (!currentBlock.hasValidTransaction()) {
          return false;
        }
        }
      }
  
      return true;
    }
  }

module.exports.Transaction = Transaction
module.exports.Block = Block
module.exports.Blockchain = Blockchain