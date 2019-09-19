//client/print_sendable_hello-world.js
const DepositTransaction = require('../deposit_transaction');
const transactions = require('@liskhq/lisk-transactions');
const { EPOCH_TIME } = require('@liskhq/lisk-constants');

const getTimestamp = () => {
    // check config file or curl localhost:4000/api/node/constants to verify your epoc time
    var now = new Date();
    var localOffset = (-1) * now.getTimezoneOffset() * 30000;
    var stamp = Math.round(new Date(now + localOffset).getTime() / 1000);

    const millisSinceEpoc = stamp - Date.parse(EPOCH_TIME);
    const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
    return  parseInt(inSeconds);
}

let tx =  new DepositTransaction({ // the desired transaction gets created and signed
    asset: {
        deposit: 'abce', // we save the string 'world' into the 'hello' asset
    },
    fee: `${transactions.utils.convertLSKToBeddows('1')}`, // we set the fee to 1 LSK
    recipientId: '10881167371402274308L', // address of dummy delegate genesis_100
    timestamp: getTimestamp(),
});

tx.sign('wagon stock borrow episode laundry kitten salute link globe zero feed marble');

console.log(tx.stringify()); // the transaction is displayed as JSON object in the console
process.exit(0); // stops the process after the transaction object has been printed
