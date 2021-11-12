const SHA256 = require('crypto-js/sha256')
const {Transaction} = require("./transaction");
const {Block} = require("./block")
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");




class Blockchain {
    // Contain all logic at the chain level
    constructor() {
      this.chain = [this.createGenesisBlock()];
      this.difficulty = 2;  // controls time it takes to mine a block
      this.pendingTransactions = [];  // transactions to be mined into next block
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
      let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
      block.mineBlock(this.difficulty, 100.); // TODO FIX BALANCE!!!

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

      if (transaction.amount <= 0){
        throw new Error("Transaction amounts must be larger than zero.")
      }

      if (this.getBalanceOfAddress(transaction.fromAddress) < transaction.amount){
        throw new Error("Balance too low")
      }

      this.pendingTransactions.push(transaction);
    }
  
    getBalanceOfAddress(address){
      let balance = 0.;

      for (const block of this.chain){
        for (const trans of block.transactions){
          if (trans.fromAddress === address){
            balance -= trans.amount;
          }
        
          if (trans.toAddress === address){
            balance += trans.amount
          }
        }
      }

      return "Balance of "+address + " \nResult: " + balance
    }

    getAllTransactionsForWallet(address){
      // Get all transactions for a given wallet
      const txs = []

      for (const block of this.chain){
        for (const tx of block.transactions){
          if (tx.fromAddress == address || tx.toAddress == address){
            txs.push(tx)
          }
        }
      }
    }

    isChainValid(){
      // Check if the Genesis block hasn't been tampered with by comparing
      // the output of createGenesisBlock with the first block on our chain
      const realGenesis = JSON.stringify(this.createGenesisBlock());
  
      if (realGenesis !== JSON.stringify(this.chain[0])) {
        return false;
      }
  
      // Check the remaining blocks on the chain to see if their hashes and
      // signatures are correct
      for (let i = 1; i < this.chain.length; i++) {
        const currentBlock = this.chain[i];
        const previousBlock = this.chain[i - 1];
  
        if (previousBlock.hash !== currentBlock.previousHash) {
          console.log('Invalid previous hash')
          return false;
        }

        if (currentBlock.hash !== currentBlock.calculateHash()) {
          console.log('Invalid hash')
          return false;
        }

        if (!currentBlock.hasValidTransaction()) {
          console.log('Invalid transactions in new Block')
          return false;
        }

        if (!currentBlock.isValidBlockStructure()){
          console.log('Invalid block structure')
          return false
        }
      }
  
      return true;
    }
    // Need some logic on choosing the longest chain if two conflicting

  }

module.exports.Blockchain = Blockchain