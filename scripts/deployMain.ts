import { Address, toNano } from '@ton/core';
import { Main } from '../wrappers/Main';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const main = provider.open(
        Main.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('Main')
        )
    );

    await main.sendDeploy(provider.sender(), toNano('0.005'));
    await provider.waitForDeploy(main.address);


    const sender = provider.sender();
    await main.sendSupply(sender, {
        value: toNano('0.002'),
    });





}
