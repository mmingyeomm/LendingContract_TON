import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type HelloConfig = {
    id: number;
    counter: number;
};

export function helloConfigToCell(config: HelloConfig): Cell {
    return beginCell().storeUint(config.id, 32).storeUint(config.counter, 32).endCell();
}

export const Opcodes = {
    supply: 0x480074d8,
    borrow: 0xcfc248e4, 
};

export class Main implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Main(address);
    }

    static createFromConfig(config: HelloConfig, code: Cell, workchain = 0) : Main {
        const data = helloConfigToCell(config);
        const init = { code, data };
        return new Main(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendIncrement(provider: ContractProvider, via: Sender) {
        const messageBody = beginCell()
          .storeUint(1, 32) // op (op #1 = increment)
          .storeUint(0, 64) // query id
          .endCell();
        await provider.internal(via, {
          value: "0.002", // send 0.002 TON for gas
          body: messageBody
        });
      }



    async sendIncrease(
        provider: ContractProvider,
        via: Sender,
        opts: {
            increaseBy: number;
            value: bigint;
            queryID?: number;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.supply, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .storeUint(opts.increaseBy, 32)
                .endCell(),
        });
    }

    async sendSupply(
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint;
            queryID?: number;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.supply, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .endCell(),
        });
    }

    async getSupplyBySender(
        provider: ContractProvider,
        sender: Sender
    ): Promise<bigint> {
        // Get the sender's address
        const senderAddress = (sender as any).address;
        return this.getUserSupply(provider, senderAddress);
    }

    async getUserSupply(
        provider: ContractProvider,
        address: Address
    ): Promise<bigint> {
        
        const result = await provider.get('get_supply', [
            { type: 'slice', cell: beginCell().storeAddress(address).endCell() }
        ]);
        
        return result.stack.readBigNumber();
    }
    

    async getStorage(provider: ContractProvider) {
        const result = (await provider.get('get_storage', [])).stack;
    
        // Parse the returned values
        const storageCell = result.readCell();
  
        return { storageCell };
    }



    async getCounter(provider: ContractProvider) {
        const result = await provider.get('get_counter', []);
        return result.stack.readNumber();
    }



    async getMaxBorrowAmount(
        provider: ContractProvider,
        address: Address
    ): Promise<bigint> {
        const result = await provider.get('get_max_borrow_amount', [
            { type: 'slice', cell: beginCell().storeAddress(address).endCell() }
        ]);
        
        return result.stack.readBigNumber();
    }

    // Helper method to get max borrow amount for the sender
    async getMaxBorrowAmountBySender(
        provider: ContractProvider,
        sender: Sender
    ): Promise<bigint> {
        const senderAddress = (sender as any).address;
        return this.getMaxBorrowAmount(provider, senderAddress);
    }

}
