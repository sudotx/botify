import { ethers } from "ethers";

export class EigenLayerService {
    private contract: ethers.Contract;

    private readonly PLAY_EIGEN_LAYER_ABI = [
        'function deposit(uint256 amount) external',
        'function repay(uint256 amount) external',
        'function checkBalance(address account) view returns (uint256)'
    ];

    private readonly PLAY_EIGEN_LAYER_ADDRESS = '0xYourPlayEigenLayerContractAddress';

    constructor() {
        this.contract = new ethers.Contract(
            this.PLAY_EIGEN_LAYER_ADDRESS,
            this.PLAY_EIGEN_LAYER_ABI,
        );
    }

    async deposit(amount: string) {
        try {
            // Convert amount to units if necessary
            const depositAmount = ethers.parseUnits(amount, 'ether'); // Assuming 'ether' is the unit for the contract

            // Send deposit transaction
            const tx = await this.contract.deposit(depositAmount);
            console.log('Deposit Transaction Hash:', tx.hash);

            // Wait for transaction to be confirmed
            await tx.wait();
            console.log('Deposit confirmed');
        } catch (error) {
            console.error('Error executing deposit:', error);
        }
    }

    async repay(amount: string) {
        try {
            // Convert amount to units if necessary
            const repayAmount = ethers.parseUnits(amount, 'ether'); // Assuming 'ether' is the unit for the contract

            // Send repay transaction
            const tx = await this.contract.repay(repayAmount);
            console.log('Repay Transaction Hash:', tx.hash);

            // Wait for transaction to be confirmed
            await tx.wait();
            console.log('Repay confirmed');
        } catch (error) {
            console.error('Error executing repay:', error);
        }
    }

    async checkBalance(account: string): Promise<string> {
        try {
            // Convert address to PublicKey if necessary
            const balance = await this.contract.checkBalance(account);
            // Convert balance to ether if necessary
            return ethers.formatUnits(balance, 'ether'); // Assuming 'ether' is the unit for the contract
        } catch (error) {
            console.error('Error fetching balance:', error);
            return 'Error';
        }
    }
}
