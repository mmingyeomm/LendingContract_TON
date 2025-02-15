import { toNano } from '@ton/core';
import { Hello } from '../wrappers/Hello';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const hello = provider.open(
        Hello.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('Hello')
        )
    );

    await hello.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(hello.address);

    console.log('ID', await hello.getID());
}
