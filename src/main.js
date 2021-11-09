const {Transaction, Blockchain} = require("./blockchain")

let myCoin = new Blockchain()

myCoin.createTransaction(new Transaction("A2", "A1", 50))
myCoin.createTransaction(new Transaction("A1", "A2", 100))

myCoin.minePendingTransaction("A2")
console.log(myCoin.getBalanceOfAdress("A1"))

// console.log(JSON.stringify(myCoin, null, 4))