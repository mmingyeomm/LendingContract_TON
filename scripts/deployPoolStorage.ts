import { toNano } from '@ton/core';
import { PoolStorage } from '../wrappers/PoolStorage';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    // Compile the PoolStorage contract
    const poolStorage = provider.open(
        PoolStorage.createFromCode(
            await compile('PoolStorage')
        )
    );

    // Define the data to store
    const value = toNano('0.002'); // Value in NanoTON (adjust as needed)
    const queryID = 5; // Query ID

//  이거는 userAddress와 userAmount 가져오는 함수 호출 이것도 됨
    const getResult = await poolStorage.getSupply();

    console.log(getResult);



    // 이거는 됨. Store Data함수 호출 됨
    // const result = await poolStorage.sendStoreData(provider.sender(), { value, queryID });

    // console.log(result);



    // Wait for the contract to be deployed
    // await provider.waitForDeploy(poolStorage.address);

    // console.log('PoolStorage deployed at address:', poolStorage.address.toString());
}
