import fastify from 'fastify'
import { createSSEManager, FastifyHttpAdapter } from '@soluzioni-futura/sse-manager'
import { DbManager } from './manager/dbManager'
import  dotenv  from 'dotenv';
import { Crypto } from './entity/crypto';
import { HtmlManager } from './ui/htmlManager';    
import { CryptoManager } from './manager/cryptoManager';
import { User } from './entity/user';
import { Status, Transaction, TransactionType } from './entity/transaction';
import { Wallet } from './entity/wallet';


const server = fastify({ logger: true })
// eslint-disable-next-line @typescript-eslint/no-require-imports
server.register(require('@fastify/formbody'))

 //init user
 export const user = new User({
    id : '1',
    name : "User", 
    balance : process.env.STARTING_BALANCE || 100000
})


void (async () => {

    dotenv.config({path : "../resources/.env"})

    const htmlManager = new HtmlManager()
    const cryptoManager = new CryptoManager()

    //init Crypto Data
    const dbManager = new DbManager()
    //dbManager.clearDb()
    //dbManager.initCrypto()
    //dbManager.initUser()
    
    let user = new User((await dbManager.getUserById('1')).rows[0])


    setInterval(async() => {
        const resultToArchive  = await dbManager.getTransactionToArchive(user.id)
        const transactionToArchive = resultToArchive.rows.map( r => new Transaction(r))
        transactionToArchive.forEach(t => dbManager.archiveTransaction(t))
        dbManager.deleteProcessedTranscation(user.id)
        sendTransactionForm()
        

        const result  = await dbManager.getTransactionToProcess(user.id)
        const transactionList = result.rows.map( r => new Transaction(r))
        const resultWallet  = await dbManager.getUserWallet(user.id)
        const wallet = resultWallet.rows.map( r => new Wallet(r))
        const resultCrypto  = await dbManager.getCryptoList()
        const cryptoList = resultCrypto.rows.map( r => new Crypto(r))

        for(const t of transactionList){
            const transaction = cryptoManager.checkIfTransactionIsValid(t, wallet, user, cryptoList);
        
            if(transaction.status === Status.completed){
                const walletIndex = wallet.findIndex((x : Wallet) => x.cryptoId === t.cryptoId);
                const cryptoIndex = cryptoList.findIndex((x : Crypto) => x.id === t.cryptoId);
                
                if(transaction.type === TransactionType.sell){
                    if(walletIndex !== -1) {
                        wallet[walletIndex].quantity -= transaction.quantity;
                        dbManager.updateUserWallet(wallet[walletIndex]);
                    }
                    
                    user.balance = Number( (user.balance - (t.quantity * t.price)).toFixed(2));
                    
                    if(cryptoIndex !== -1) {
                        cryptoList[cryptoIndex].quantity += transaction.quantity;
                        dbManager.updateCryptoQuantity(cryptoList[cryptoIndex]);
                    }
                } else { 
                    if(cryptoIndex !== -1) {
                        cryptoList[cryptoIndex].quantity -= transaction.quantity;
                        dbManager.updateCryptoQuantity(cryptoList[cryptoIndex]);
                    }
        
                    user.balance = Number((user.balance - (t.quantity * t.price)).toFixed(2));
        
                    if(walletIndex !== -1) {
                        wallet[walletIndex].quantity += transaction.quantity;
                        dbManager.updateUserWallet(wallet[walletIndex]);
                    } else {
                        dbManager.insertUserWallet(user.id, transaction.cryptoId, transaction.quantity);
                    }
                }
            }
        
            dbManager.updateTransactionQueue(transaction);
            sendNewBalance();
            dbManager.updateUserBalance(user)
            user = new User((await dbManager.getUserById('1')).rows[0])
            
            if(tableType === 'table'){
                sendUpdatedTransaction(transactionList);
            } else {
                const resultHistory  = await dbManager.getTransactionHistory(user.id)
                const transactionHistory = resultHistory.rows.map( r => new Transaction(r))
                sendUpdatedTransaction(transactionHistory);
            }
            const resultNew  = await dbManager.getCryptoList();
            const newCryptoList = resultNew.rows.map( r => new Crypto(r))
            sendNewCryptoList(newCryptoList)
        }
        //console.log(transactionList)
        

        
    }, 5000)


    //SSE manager
    const sseManager = await createSSEManager({
        httpAdapter: new FastifyHttpAdapter()
    })

    const cryptoRoom = "crypto-room"
    const balanceRoom = "balance-room"
    const transactionRoom = "transactionRoom"
    const walletRoom = "walletRoom"
    let tableType = 'table'

    //broadcast dei nuovi valori
    setInterval(async() => {
        const result  = await dbManager.getCryptoList();
        const cryptoList = result.rows.map( r => new Crypto(r))
        const updatedCrypto = cryptoManager.changeMarketValue(cryptoList)
        await sendNewCryptoList(updatedCrypto)
    }, 10000)

    async function sendNewCryptoList(cryptoList : Crypto[]){
        await sseManager.broadcast(cryptoRoom, { data: htmlManager.getCryptoTable(cryptoList)})
    }

    async function sendNewBalance(){
        await sseManager.broadcast(balanceRoom, { data: user.balance.toString() })
        sendUpdatedWallet()
    }

    async function sendUpdatedWallet(){
        const result  = await dbManager.getUserWallet(user.id);
        const wallet = result.rows.map( r => new Wallet(r))
        await sseManager.broadcast(walletRoom, { data: htmlManager.getUserWallet(wallet) })
    }

    async function sendUpdatedTransaction(transactionList : Transaction[]){
        await sseManager.broadcast(transactionRoom, { data: htmlManager.getTransactionTable(transactionList, tableType) })
    }

    async function sendTransactionForm(){
        let transactionList
        if(tableType === 'table'){
            const resultT  = await dbManager.getTransactionToProcess(user.id)
            transactionList = resultT.rows.map( r => new Transaction(r))
        } else {
            const resultT  = await dbManager.getTransactionHistory(user.id)
            transactionList = resultT.rows.map( r => new Transaction(r))
        }
        sendUpdatedTransaction(transactionList)
        const result  = await dbManager.getCryptoList();
        const cryptoList = result.rows.map( r => new Crypto(r))
        return htmlManager.getTransactionForm(cryptoList)
    }


    //HTML api
    server.get('/', async (request, reply) => {
        const result  = await dbManager.getCryptoList();
        const cryptoList = result.rows.map( r => new Crypto(r))
        reply.type('text/html').send(htmlManager.getMainpage(cryptoList, user))
    }) 


    server.get("/crypto-list", async(req, res) => {
        const sseStream = await sseManager.createSSEStream(res)
        const result  = await dbManager.getCryptoList();
        const cryptoList = result.rows.map( r => new Crypto(r))
        sseStream.broadcast({ data: htmlManager.getCryptoTable(cryptoList)})
        await sseStream.addToRoom(cryptoRoom)
        console.log("Successfully joined cryptoRoom")
    })

    server.get("/wallet", async(req, res) => {
        const sseStream = await sseManager.createSSEStream(res)
        const result  = await dbManager.getUserWallet(user.id);
        const wallet = result.rows.map( r => new Wallet(r))
        sseStream.broadcast({ data: htmlManager.getUserWallet(wallet)})
        await sseStream.addToRoom(walletRoom)
        console.log("Successfully joined walletRoom")
    })

    server.get("/transaction-table", async(req, res) => {
        const sseStream = await sseManager.createSSEStream(res)
        const resultT  = await dbManager.getTransactionQueue(user.id);
        const transactionList = resultT.rows.map( r => new Transaction(r))
        sseStream.broadcast({ data: htmlManager.getTransactionTable(transactionList, tableType)})
        await sseStream.addToRoom(transactionRoom)
        console.log("Successfully joined transactionRoom")
    })


    server.get("/show-transaction-history", async() => {
        tableType = 'history'
        const resultT  = await dbManager.getTransactionHistory(user.id);
        const transactionList = resultT.rows.map( r => new Transaction(r))
        return htmlManager.getTransactionTable(transactionList, tableType)
    })
    server.get("/show-transaction-table", async() => {
        tableType = 'table'
        const resultT  = await dbManager.getTransactionQueue(user.id);
        const transactionList = resultT.rows.map( r => new Transaction(r))
        return htmlManager.getTransactionTable(transactionList, tableType)
    })

    server.get("/balance", async(req, res) => {
        const sseStream = await sseManager.createSSEStream(res)
        sseStream.broadcast({ data: user.balance.toString() })
        await sseStream.addToRoom(balanceRoom)
        console.log("Successfully joined balanceRoom")
    })   

    server.post("/sell", async(req) => {
        const data = req.body as {crypto : string, quantity : number}
        const crypto = new Crypto((await dbManager.getCrypto(data.crypto)).rows[0])
        if(crypto && data.quantity){
            dbManager.putTransactionInQueue(user, crypto, data.quantity, TransactionType.sell)
        }
        return sendTransactionForm()
    })

    server.post("/buy",async(req) => {
        const data = req.body as {crypto : string, quantity : number}
        const crypto = new Crypto((await dbManager.getCrypto(data.crypto)).rows[0])
        if(crypto && data.quantity){
            dbManager.putTransactionInQueue(user, crypto, data.quantity, TransactionType.buy)
        }
        return sendTransactionForm()
    })



    //Json api
    const baseJsonPath = '/api'

    server.get(baseJsonPath+'/crypto', async () => {
        const result  = await dbManager.getCryptoList();
        const cryptoList = result.rows.map( r => new Crypto(r))
        return JSON.stringify(cryptoList)
    })

    server.get(baseJsonPath+'/transactions', async () => {
        const resultT  = await dbManager.getTransactionHistory(user.id);
        const transactionList = resultT.rows.map( r => new Transaction(r))
        return JSON.stringify(transactionList)    })

    server.post(baseJsonPath+'/transactions', async (req) => {
        const data = req.body as {crypto : string, quantity : number, type: TransactionType}
        const crypto = new Crypto((await dbManager.getCrypto(data.crypto)).rows[0])
        if(crypto && data.quantity && data.type){
            dbManager.putTransactionInQueue(user, crypto, data.quantity, data.type)
        }
        return 'pong\n'
    })



    server.listen({ port: 4000, host: '0.0.0.0' }, (err, address) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
        console.log(`Server listening at ${address}`)
    })


    
})().catch(console.error)

