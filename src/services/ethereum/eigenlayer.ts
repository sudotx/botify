import { ethers } from "ethers";

const PLAY_EIGEN_LAYER_ABI = [
    'function deposit(uint256 amount) external',
    'function repay(uint256 amount) external',
    'function checkBalance(address account) view returns (uint256)'
];

const PLAY_EIGEN_LAYER_ADDRESS = '0xYourPlayEigenLayerContractAddress';

export class EigenLayerService {
    private contract: ethers.Contract;

    constructor() {
        this.contract = new ethers.Contract(PLAY_EIGEN_LAYER_ADDRESS, PLAY_EIGEN_LAYER_ABI);
    }

    private async executeTransaction(method: string, amount: string) {
        const parsedAmount = ethers.parseUnits(amount, 'ether');
        try {
            const tx = await this.contract[method](parsedAmount);
            console.log(`${method} Transaction Hash:`, tx.hash);
            await tx.wait();
            console.log(`${method} confirmed`);
            return tx;
        } catch (error) {
            console.error(`Error executing ${method}:`, error);
            throw error;
        }
    }

    async deposit(amount: string) {
        return this.executeTransaction('deposit', amount);
    }

    async repay(amount: string) {
        return this.executeTransaction('repay', amount);
    }

    async checkBalance(account: string): Promise<string> {
        try {
            const balance = await this.contract.checkBalance(account);
            return ethers.formatUnits(balance, 'ether');

        } catch (error) {
            console.error('Error fetching balance:', error);
            throw error;
        }
    }
}
