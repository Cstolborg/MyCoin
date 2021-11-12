const SHA256 = require('crypto-js/sha256')
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");



class Transaction {
    // Handles logic of each transaction
    constructor(fromAddress, toAddress, amount) {
      this.fromAddress = fromAddress
      this.toAddress = toAddress
      this.amount = amount
      this.timestamp = Date.now()
    }
  
    calculateHash(){
      return SHA256(this.toAddress, this.fromAddress, this.amount + this.timestamp).toString();
    }
  
    signTransaction(signingKey){
      // Signs a transaction using a signingKey, which is an Elliptic keypair containing private key
      if (signingKey.getPublic('hex') !== this.fromAddress){
        throw new Error("Your signing key does not match your wallet");
      }
  
      // Calculate hash of transaction and sign it with key
      const hashTx = this.calculateHash();
      const sig = signingKey.sign(hashTx, "base64");
  
      this.signature = sig.toDER('hex');
    }
  
    isValid(){
      // Check if transaction is valid
      // TODO change null address to a special "treasury" address
      if (this.fromAddress === null) return true
  
      if (!this.signature || this.signature.length === 0){
        throw new Error("No signature")
      }
  
      // Check that transaction is signed and that signature matches publicKey
      const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
      return publicKey.verify(this.calculateHash(), this.signature);
    }
  
  }

  module.exports.Transaction = Transaction
