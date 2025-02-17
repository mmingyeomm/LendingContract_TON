import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from "@ton/core";

export class PoolStorage implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  // Create an instance of the contract from an existing address
  static createFromAddress(address: Address) {
    return new PoolStorage(address);
  }

  // Create an instance of the contract from the code and initial storage data
  static createFromCode(code: Cell, workchain = 0): PoolStorage {
    const init = { code, data: new Cell() }; // Empty initial data
    return new PoolStorage(contractAddress(workchain, init), init);
  }

  // Deploy the contract
  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  // Send a message to store the sender's address and message value
  async sendStoreData(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint; // TONs to send with the message
      queryID?: number; // Optional query ID
    }
  ) {
    // Create the message body
    const messageBody = beginCell()
      .storeUint(opts.queryID ?? 0, 64) // Query ID (default to 0 if not provided)
      .endCell();

    // Send the internal message
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: messageBody,
    });
  }

  // Retrieve the stored data (supply cell, sender's address, and value)
  async getSupply(provider: ContractProvider) {
    const result = (await provider.get('get_supply', [])).stack;

    // Parse the returned values
    const supplyCell = result.readCell();
    const userAddress = result.readCell();
    const userAmount = result.readNumber();

    return { supplyCell, userAddress, userAmount };

    
}
}
