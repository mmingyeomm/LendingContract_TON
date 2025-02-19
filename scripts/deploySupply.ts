import { Address, toNano } from '@ton/core';
import { compile, NetworkProvider } from '@ton/blueprint';
import { Supply } from '../wrappers/Supply';

export async function run(provider: NetworkProvider) {
    // Compile the PoolStorage contract
    const supply = provider.open(
        Supply.createFromCode(
            await compile('Supply')
        )
    );


    // await supply.sendDeploy(provider.sender(), toNano('0.01'));


    // await provider.waitForDeploy(supply.address);

    // await supply.sendSupply(provider.sender(), toNano('0.005'))

    // Supply TON


    // const getResult = await supply.getUserSupply(Address.parse("0QAXW4dcA7tjKHtiGjD4zJnADPK0qVRf9i5FJxzDBkKfxRMa"));

    // console.log(getResult);



    const ltv = await supply.getLTV();
    console.log(ltv);


}
