//deposit_transactio.js
const {
    transactions: { BaseTransaction },
    TransactionError,
} = require('lisk-sdk');

class DepositTransaction extends BaseTransaction {
      
  /**
    * Set the `DepositTransaction` transaction TYPE to `10`.
    * Every time a transaction is received, it gets differentiated by the type.
    * The first 10 types, from 0-9 is reserved for the default Lisk Network functions. 
    */
   static get TYPE () {
    return 11;
}

/**
* Set the `DepositTransaction` transaction FEE to 1 LSK.
* Every time a user posts a transaction to the network, the transaction fee is paid to the delegate who includes the transaction into the block that the delegate forges.
*/
static get FEE () {
    return `${10 ** 8}`;
};

/**
* Prepares the necessary data for the `apply` and `undo` step.
* The "deposit" property will be added only to sender's account, therefore it's the only resource needed in the `applyAsset` and `undoAsset` steps. 
*/
async prepare(store) {
    await store.account.cache([
        {
            address: this.senderId,
            //address: this.recipientId,
        },
    ]);
    await store.account.cache([
        {
            address: this.recipientId,
        },
    ]);
}

/**
* Validation of the value of the "deposit" property, defined by the `depositTransaction` transaction signer.
* The implementation below checks, that the value of the "deposit" property needs to be a string, no longer than 64 characters. 
*/
validateAsset() {
    const errors = [];
    if (!this.asset.deposit || typeof this.asset.deposit !== 'string' || this.asset.deposit.length > 64) {
        errors.push(
            new TransactionError(
                'Invalid "asset.deposit" defined on transaction',
                this.id,
                '.asset.deposit',
                this.asset.deposit,
                'A string value no longer than 64 characters',
            )
        );
    }
    return errors;
}

/**
* applyAsset is where the custom logic of the deposit World app is implemented. 
* applyAsset() and undoAsset() use the information about the sender's account from the `store`.
* Here we can store additional information about accounts using the `asset` field. The content of property of "deposit" transaction's asset gets saved into the "deposit" property of the account's asset.
*/
applyAsset(store) {
    console.log("applyAsset");
    const errors = [];
    const sender = store.account.get(this.senderId);
    const newObj = { ...sender, asset: { deposit: this.asset.deposit } };
    store.account.set(sender.address, newObj);

    const recipient = store.account.get(this.recipientId);
    const newRecip = { ...sender, asset: { from: recipient.address} };
    store.account.set(recipient.address, newRecip);
   
    return errors; // array of TransactionErrors, returns empty array if no errors are thrown
}

/**
* Inverse of `applyAsset`.
* Undoes the changes made in applyAsset() step - reverts to the previous value of "deposit" property, if not previously set this will be null.
*/
undoAsset(store) {
    const sender = store.account.get(this.senderId);
    const oldObj = { ...sender, asset: null };
    store.account.set(sender.address, oldObj);
    return [];
}

}

module.exports = DepositTransaction;
