import { Address, toNano } from '@ton/core';
import { Main } from '../wrappers/Main';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const myaddress = Address.parseFriendly('0QAXW4dcA7tjKHtiGjD4zJnADPK0qVRf9i5FJxzDBkKfxRMa').address;


    const address = Address.parseFriendly('kQDA_M6KBIf3RPv4o1ORLcxQBiPu3NEuvVIqbyTGishxFpI5').address;

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }
    const main = provider.open(Main.createFromAddress(address));
    


    // const result = await main.sendSupply(provider.sender(), {
    //     value: toNano('0.02'),
    // });

    // console.log(result)

    const specificAddress = Address.parseFriendly("0QAXW4dcA7tjKHtiGjD4zJnADPK0qVRf9i5FJxzDBkKfxRMa").address;
    const specificResult = await main.getUserSupply(specificAddress);
    console.log("specific address result : " + specificResult);

    // const getResult = await main.getStorage();
    // console.log("result : " + getResult); 

    // const maxBorrowAmount = await main.getMaxBorrowAmount(myaddress);
    // console.log('Max borrowable amount:', maxBorrowAmount);



    ui.clearActionPrompt();
}
