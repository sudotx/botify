import { ethers, MaxUint256 } from 'ethers';
import { EthService } from '../handlers/eth.handler';
import { EigenLayerService } from '@/services/ethereum/eigenlayer';

const ethService = new EthService(`${process.env.ETH_RPC}`);

const UNISWAP_V2_ROUTER_ABI = [
    'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external returns (uint[] memory amounts)',
    'function approve(address spender, uint256 amount) external returns (bool)'
];
const UNISWAP_V2_ROUTER_ADDRESS = '0x5C69bEe701ef814a2b6A1b3eeb8d6c38F5d1f7e0';

const TOKEN_A_ADDRESS = '0xTOKEN_A_ADDRESS'; // Address of token A
const TOKEN_B_ADDRESS = '0xTOKEN_B_ADDRESS'; // Address of token B (e.g., USDC)
const AMOUNT_IN = ethers.parseUnits('1', 18); // Amount of TOKEN_A to swap (e.g., 1 TOKEN_A)

const uniswapRouter = new ethers.Contract(UNISWAP_V2_ROUTER_ADDRESS, UNISWAP_V2_ROUTER_ABI);

const eg = new EigenLayerService()

export async function repayAndSwapTokens(amount: string) {
    try {
        // Step 1: Repay using EigenLayer
        const repayAmount = ethers.parseUnits(amount, 'ether');
        const repayTx = await eg.repay(repayAmount.toString())

        console.log(repayTx);

        // Step 2: Swap the received tokens on Uniswap
        // Approve Uniswap Router to spend the tokens
        const tokenAContract = new ethers.Contract(TOKEN_A_ADDRESS, UNISWAP_V2_ROUTER_ABI);
        await tokenAContract.approve(UNISWAP_V2_ROUTER_ADDRESS, MaxUint256);

        // Perform the swap on Uniswap
        const path = [TOKEN_A_ADDRESS, TOKEN_B_ADDRESS];
        const amountOutMin = 0; // Minimum amount of TOKEN_B to receive
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

        const swapTx = await uniswapRouter.swapExactTokensForTokens(AMOUNT_IN, amountOutMin, path, "", deadline);
        await swapTx.wait(); // Wait for transaction to be confirmed
        console.log(`Swap transaction hash: ${swapTx.hash}`);

        const balanceAfterA = await ethService.getErc20Balance(TOKEN_A_ADDRESS, "");
        console.log(`Balance of TOKEN_A after swap: ${balanceAfterA}`);
        const balanceAfterB = await ethService.getErc20Balance(TOKEN_B_ADDRESS, "");
        console.log(`Balance of TOKEN_B after swap: ${balanceAfterB}`);
    } catch (error) {
        console.error('Error executing repay and swap:', error);
    }
}

export async function swapMultipleTimes(NUM_SWAPS: number) {
    try {
        for (let i = 0; i < NUM_SWAPS; i++) {
            console.log(`Performing swap ${i + 1} of ${NUM_SWAPS}`);

            // Check balance of TOKEN_A before swap
            const balanceBeforeA = await ethService.getErc20Balance(TOKEN_A_ADDRESS, "wallet");
            console.log(`Balance of TOKEN_A before swap ${i + 1}: ${balanceBeforeA}`);

            // Approve Uniswap Router to spend TOKEN_A
            const tokenAContract = new ethers.Contract(TOKEN_A_ADDRESS, UNISWAP_V2_ROUTER_ABI);
            await tokenAContract.approve(UNISWAP_V2_ROUTER_ADDRESS, MaxUint256);

            // Perform the swap on Uniswap
            let path, amountOutMin, deadline;
            if (i % 2 === 0) {
                // Swap TOKEN_A to TOKEN_B
                path = [TOKEN_A_ADDRESS, TOKEN_B_ADDRESS];
                amountOutMin = 0; // Minimum amount of TOKEN_B to receive
            } else {
                // Swap TOKEN_B to TOKEN_A
                path = [TOKEN_B_ADDRESS, TOKEN_A_ADDRESS];
                amountOutMin = 0; // Minimum amount of TOKEN_A to receive
            }
            deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

            const tx = await uniswapRouter.swapExactTokensForTokens(AMOUNT_IN, amountOutMin, path, "wallet", deadline);
            await tx.wait(); // Wait for transaction to be confirmed
            console.log(`Swap transaction hash: ${tx.hash}`);

            // Check balance of the tokens after swap
            const balanceAfterA = await ethService.getErc20Balance(TOKEN_A_ADDRESS, "wallet");
            console.log(`Balance of TOKEN_A after swap ${i + 1}: ${balanceAfterA}`);
            const balanceAfterB = await ethService.getErc20Balance(TOKEN_B_ADDRESS, "wallet");
            console.log(`Balance of TOKEN_B after swap ${i + 1}: ${balanceAfterB}`);
        }
    } catch (error) {
        console.error('Error executing strategy:', error);
    }
}
