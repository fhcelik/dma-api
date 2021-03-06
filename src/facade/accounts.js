'use strict';
const fs = require('fs');

const accountsRaw = fs.readFileSync('src/data/accounts.json', 'utf8');

exports.calculateDeposit = (money, currency) => {
    let deposit = 0;
    if(!(currency && money) || money<0) return 0;
    ;
    switch(currency) {
        case 'MXN': deposit = money/10; break;
        case 'USD': deposit = money * 2; break;
        case 'CAD': deposit = money; break;
        default : deposit = 0;
    }

    return deposit;
}

exports.getAccounts = (custId) => {

    const accountsIds = JSON.parse(accountsRaw)

    const accounts = accountsIds.filter(account =>{ 
        const { custId:customerId } = account;
       
        return customerId == custId; 
    })
    console.log(accounts)
    return accounts;
}

exports.depositMoney = (accId, money, currency, custId) => {
    let lastBalance = 0;
    
    const accountIds = JSON.parse(accountsRaw);
    
    const account = accountIds.map(acc =>{ 
        const { accountId:accountId, custId:customerId, balance:balance } = acc;
        
        if(accountId == accId && customerId == custId){ 
            lastBalance = balance + exports.calculateDeposit(money, currency);     
            
        }else{
            lastBalance = balance;
        } 
        acc = {...acc, balance:lastBalance}
        return acc;
    })
    
    fs.writeFileSync("src/data/accounts.json",JSON.stringify(account));
 
}

exports.withdrawMoney = (accId, money, currency, custId) => {
    let lastBalance = 0;
    const accountIds = JSON.parse(accountsRaw);
    
    const account = accountIds.map(acc =>{ 
        const { accountId:accountId, custId:customerId, balance:balance } = acc;
        
        if(accountId == accId && customerId == custId){  
            lastBalance = balance - exports.calculateDeposit(money, currency);     
        }else{
            lastBalance = balance;
        } 
        acc = {...acc, balance:lastBalance}
       
        return acc;
    })

    fs.writeFileSync("src/data/accounts.json",JSON.stringify(account));
}

exports.transferMoney = (sourceAccId, targetAccId, transferMoney, custId) => {
    let lastBalance = 0;
    const accountIds = JSON.parse(accountsRaw);
    
    const account = accountIds.map(acc =>{ 
        const { accountId:accountId, custId:customerId, balance:balance } = acc;
        
        if(accountId == sourceAccId && customerId == custId){  
            lastBalance = balance - transferMoney;   
        }else if (accountId == targetAccId){
            lastBalance = Number(balance) + transferMoney; 
        }else{
            lastBalance = balance;
        }

        acc = {...acc, balance:lastBalance}
        
        return acc;
    })

    fs.writeFileSync("src/data/accounts.json",JSON.stringify(account));
}

