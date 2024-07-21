import { ethers } from 'ethers';

export class EthService {
    initProvider(arg0: string) {
        throw new Error('Method not implemented.');
    }
    private provider: ethers.JsonRpcProvider;
    private wallet?: ethers.Wallet;

    constructor(rpcUrl: string) {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
    }

    public initWallet(privateKey: string): void {
        this.wallet = new ethers.Wallet(privateKey, this.provider);
    }

    public async getEthBalance(address: string): Promise<string> {
        const balance = await this.provider.getBalance(address);
        return ethers.formatEther(balance);
    }

    public async sendEthTransaction(to: string, amountInEther: string): Promise<ethers.TransactionResponse> {
        if (!this.wallet) {
            throw new Error('Wallet is not initialized.');
        }
        const tx = await this.wallet.sendTransaction({
            to,
            value: ethers.parseUnits(amountInEther, 'ether')
        });
        return tx;
    }

    public async sendErc20Transaction(
        tokenAddress: string,
        to: string,
        amountInUnits: string
    ): Promise<ethers.TransactionResponse> {
        if (!this.wallet) {
            throw new Error('Wallet is not initialized.');
        }
        const tokenContract = new ethers.Contract(
            tokenAddress,
            ['function transfer(address to, uint256 amount) public returns (bool)'],
            this.wallet
        );
        const tx = await tokenContract.transfer(to, amountInUnits);
        return tx;
    }

    public async getErc20Balance(
        tokenAddress: string,
        address: string
    ): Promise<string> {
        const tokenContract = new ethers.Contract(
            tokenAddress,
            ['function balanceOf(address owner) public view returns (uint256)'],
            this.provider
        );
        const balance = await tokenContract.balanceOf(address);
        return balance.toString();
    }

    async getTransaction(hash: string) {
        const tx = await this.provider.getTransaction(hash)
        console.log("tx", tx)
    }

    async getTransactionReceipt(hash: string) {
        const tx = await this.provider.getTransactionReceipt(hash)
        console.log("tx", tx)
    }

    async getLogs(address: string) {
        const logs = await this.provider.getLogs({
            address: address
        })
        console.log("logs", logs)
    }

    async getLogsFromBlock(address: string, blockNumber: number) {
        const logs = await this.provider.getLogs({
            address: address,
            fromBlock: blockNumber
        })
        console.log("logs", logs)
    }

    async getLogsFromBlockToBlock(address: string, fromBlock: number, toBlock: number) {
        const logs = await this.provider.getLogs({
            address: address,
            fromBlock: fromBlock,
            toBlock: toBlock
        })
        console.log("logs", logs)
    }
}