import { ethers, MaxUint256 } from 'ethers';
import config from '@/config';
import { EigenLayerService } from '@/services/ethereum/eigenlayer';

const AMOUNT_IN = ethers.parseUnits('1', 18);
const uniswapRouter = new ethers.Contract(config.uniswap.v2.routerAddress, config.uniswap.v2.routerABI);
const eigenLayerService = new EigenLayerService();

async function approveToken(tokenAddress: string, spenderAddress: string) {
    const tokenContract = new ethers.Contract(tokenAddress, config.uniswap.v2.routerABI);
    await tokenContract.approve(spenderAddress, MaxUint256);
}

async function swapTokens(path: string[], amountIn: ethers.BigNumberish, amountOutMin: number, to: string) {
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
    const tx = await uniswapRouter.swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline);
    await tx.wait();
    return tx.hash;
}

export async function repayAndSwapTokens(amount: string) {
    try {
        const repayAmount = ethers.parseUnits(amount, 'ether');
        await eigenLayerService.repay(repayAmount.toString());

        await approveToken(config.tokens.USDT.ethereum.address, config.uniswap.v2.routerAddress);

        const path = [config.tokens.USDT.ethereum.address, config.tokens.USDC.ethereum.address];
        const swapTxHash = await swapTokens(path, AMOUNT_IN, 0, "");
        console.log(`Swap transaction hash: ${swapTxHash}`);
    } catch (error) {
        console.error('Error executing repay and swap:', error);
    }
}

export async function swapMultipleTimes(NUM_SWAPS: number) {
    try {
        for (let i = 0; i < NUM_SWAPS; i++) {
            console.log(`Performing swap ${i + 1} of ${NUM_SWAPS}`);

            await approveToken(config.tokens.USDC.ethereum.address, config.uniswap.v2.routerAddress);

            const path = i % 2 === 0
                ? [config.tokens.USDT.ethereum.address, config.tokens.USDC.ethereum.address]
                : [config.tokens.USDC.ethereum.address, config.tokens.USDT.ethereum.address];

            const swapTxHash = await swapTokens(path, AMOUNT_IN, 0, "wallet");
            console.log(`Swap transaction hash: ${swapTxHash}`);
        }
    } catch (error) {
        console.error('Error executing strategy:', error);
    }
}
