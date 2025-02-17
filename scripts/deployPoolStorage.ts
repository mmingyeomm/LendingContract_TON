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
    
    // Deploy the contract with 0.05 TON
    await poolStorage.sendDeploy(provider.sender(), toNano('0.05'));

    // Wait for the contract to be deployed
    await provider.waitForDeploy(poolStorage.address);

    console.log('PoolStorage deployed at address:', poolStorage.address.toString());
}
