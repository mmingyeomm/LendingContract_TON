import { 
    Address, 
    beginCell, 
    Cell, 
    Contract, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    SendMode,
    toNano 
} from "@ton/core";

export class Supply implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) {}

    static createFromAddress(address: Address) {
        return new Supply(address);
    }

    static createFromCode(code: Cell, workchain = 0): Supply {
        const data = beginCell().endCell(); // Empty initial data
        const init = { code, data };
        return new Supply(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getUserSupply(
        provider: ContractProvider,
        address: Address
    ): Promise<bigint> {
        
        const result = await provider.get('user_supply', [
            { type: 'slice', cell: beginCell().storeAddress(address).endCell() }
        ]);
        
        return result.stack.readBigNumber();
    }

    async sendSupply(
        provider: ContractProvider,

    ) {
        await provider.internal(via, {
            value: amount,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            // We don't need to add any data to body since the contract will use msg_value
            body: beginCell().endCell(),
        });
    }
}