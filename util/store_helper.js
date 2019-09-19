class StoreHelper {
    
    static prepareSenderAndRecipient(thisStore,thisObj) {
        await thisStore.account.cache([
            {
                address: thisObj.senderId,
            },
        ]);
        await thisStore.account.cache([
            {
                address: thisObj.recipientId,
            },
        ]);
    }

  }