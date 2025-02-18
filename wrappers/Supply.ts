import { 
    Address, 
    beginCell, 
    Cell, 
    Contract, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    SendMode 
} from "@ton/core";

// Operation codes matching the contract
const OpCodes = {
    SupplyPool: 1
} as const;

export class Supply implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) {}

    static createFromAddress(address: Address) {
        return new Supply(address);
    }

    static createFromCode(code: Cell, workchain = 0): Supply {
        const data = beginCell().endCell();
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

    async getLTV(
        provider: ContractProvider,
    ): Promise<bigint> {
        
        const result = await provider.get('ltv', []);
        
        return result.stack.readBigNumber();
    }



    async sendSupply(
        provider: ContractProvider,
        via: Sender,
        amount: bigint
    ) {
        await provider.internal(via, {
            value: amount,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(OpCodes.SupplyPool, 32) // Store the operation code
                .endCell(),
        });
    }
}

