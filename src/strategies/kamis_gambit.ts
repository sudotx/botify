import { EigenLayerService } from '@/services/ethereum/eigenlayer';
import { ethers, MaxUint256 } from 'ethers';
import { EthService } from '../handlers/eth.handler';
import config from '@/config';

const ethService = new EthService(`${process.env.ETH_RPC}`);


// const TOKEN_B_ADDRESS = '0xTOKEN_B_ADDRESS'; // Address of token B (e.g., USDC)
const AMOUNT_IN = ethers.parseUnits('1', 18); // Amount of TOKEN_A to swap (e.g., 1 TOKEN_A)

const uniswapRouter = new ethers.Contract(config.UNISWAP_V2_ROUTER_ADDRESS, config.UNISWAP_V2_ROUTER_ABI);

const eg = new EigenLayerService()


/**
 * **Repay and Swap Tokens Strategy**
 * 
 * This strategy combines token repayment using EigenLayer with a token swap on Uniswap. It is designed to manage token liquidity and execute trades efficiently.
 * 
 * **Financial Overview:**
 * - **Repayment Amount**: The amount to be repaid is specified in ether units. For example, if the repayment amount is `1 ETH`, this translates to `1,000,000,000,000,000,000` wei.
 * - **Swap Operation**: After repayment, the tokens (TOKEN_A) are swapped for another token (TOKEN_B) using Uniswap. The swap amount (`AMOUNT_IN`) is specified as `1 TOKEN_A`, equivalent to `1,000,000,000,000,000,000` wei.
 * - **Approval Limit**: The Uniswap Router is approved to spend up to `MaxUint256` tokens, which is effectively `2^256 - 1`. This is the largest possible number and ensures there is no limitation on the amount of tokens that can be spent.
 * - **Slippage and Deadlines**: 
 *   - **Slippage**: Minimum output amount (`amountOutMin`) is set to zero. This means the strategy does not guarantee any minimum amount of TOKEN_B to receive, which may expose you to significant slippage.
 *   - **Deadline**: Transactions must be completed within `20 minutes` from initiation. This timeframe helps to avoid adverse price movements.
 * 
 * **Financial Impact:**
 * - **Transaction Fees**: Gas fees are incurred for both the repayment and swap transactions. This can be a percentage of the transaction amount or a fixed amount, depending on network conditions.
 * - **Potential Slippage**: Due to the zero minimum output, slippage can impact the final amount received in TOKEN_B. The impact percentage depends on market volatility and liquidity.
 * 
 * **Usage:**
 * - **Liquidity Management**: Ideal for managing liquidity needs by repaying and then converting tokens quickly to achieve desired liquidity positions.
 * - **Market Opportunities**: Use this strategy to capitalize on favorable market conditions by converting repaid tokens into a different asset.
 */
export async function repayAndSwapTokens(amount: string) {
    try {
        // Step 1: Repay using EigenLayer
        const repayAmount = ethers.parseUnits(amount, 'ether');
        const repayTx = await eg.repay(repayAmount.toString())

        console.log(repayTx);

        // Step 2: Swap the received tokens on Uniswap
        // Approve Uniswap Router to spend the tokens
        const tokenAContract = new ethers.Contract(config.USDT_ADDRESS, config.UNISWAP_V2_ROUTER_ABI);
        await tokenAContract.approve(config.UNISWAP_V2_ROUTER_ADDRESS, MaxUint256);

        // Perform the swap on Uniswap
        const path = [config.USDT_ADDRESS, config.USDC_ADDRESS];
        const amountOutMin = 0; // Minimum amount of TOKEN_B to receive
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

        const swapTx = await uniswapRouter.swapExactTokensForTokens(AMOUNT_IN, amountOutMin, path, "", deadline);
        await swapTx.wait(); // Wait for transaction to be confirmed
        console.log(`Swap transaction hash: ${swapTx.hash}`);

        const balanceAfterA = await ethService.getErc20Balance(config.USDT_ADDRESS, "");
        console.log(`Balance of TOKEN_A after swap: ${balanceAfterA}`);
        const balanceAfterB = await ethService.getErc20Balance(config.USDC_ADDRESS, "");
        console.log(`Balance of TOKEN_B after swap: ${balanceAfterB}`);
    } catch (error) {
        console.error('Error executing repay and swap:', error);
    }
}

/**
 * **Multiple Token Swap Strategy**
 * 
 * This strategy executes a series of token swaps between TOKEN_A and TOKEN_B on Uniswap, designed to capture market inefficiencies or manage token balances through repeated trading.
 * 
 * **Financial Overview:**
 * - **Number of Swaps**: The strategy performs a specified number of swaps (`NUM_SWAPS`). For instance, with `NUM_SWAPS = 10`, the strategy will execute 10 alternating swaps.
 * - **Swap Amount**: Each swap involves an amount of `1 TOKEN_A`, which translates to `1,000,000,000,000,000,000` wei. The same amount is swapped back and forth.
 * - **Approval Limit**: The Uniswap Router is approved to handle up to `MaxUint256` tokens for each swap, ensuring ample allowance for high-frequency trading.
 * - **Path Alternation**: The strategy alternates swaps between TOKEN_A and TOKEN_B. For instance, if `NUM_SWAPS` is `10`, it will swap TOKEN_A to TOKEN_B for the first 5 swaps and TOKEN_B to TOKEN_A for the remaining 5 swaps.
 * - **Transaction Deadlines**: Each swap transaction must be completed within `20 minutes` from initiation. This helps to ensure timely execution and manage price volatility.
 * 
 * **Financial Impact:**
 * - **Transaction Fees**: Fees are incurred for each swap transaction. With multiple swaps, cumulative fees can be significant and should be factored into the overall profitability.
 * - **Slippage**: Each swap may be subject to slippage, affecting the final amounts received. Slippage percentage can vary based on market conditions and token liquidity.
 * 
 * **Usage:**
 * - **Active Trading**: Suitable for high-frequency trading strategies where frequent token exchanges are used to exploit market inefficiencies or adjust positions.
 * - **Portfolio Rebalancing**: Useful for managing and rebalancing token holdings through systematic trading over multiple transactions.
 */

export async function swapMultipleTimes(NUM_SWAPS: number) {
    try {
        for (let i = 0; i < NUM_SWAPS; i++) {
            console.log(`Performing swap ${i + 1} of ${NUM_SWAPS}`);

            // Check balance of TOKEN_A before swap
            const balanceBeforeA = await ethService.getErc20Balance(config.USDT_ADDRESS, "wallet");
            console.log(`Balance of TOKEN_A before swap ${i + 1}: ${balanceBeforeA}`);

            // Approve Uniswap Router to spend TOKEN_A
            const tokenAContract = new ethers.Contract(config.USDT_ADDRESS, config.UNISWAP_V2_ROUTER_ABI);
            await tokenAContract.approve(config.UNISWAP_V2_ROUTER_ADDRESS, MaxUint256);

            // Perform the swap on Uniswap
            let path, amountOutMin, deadline;
            if (i % 2 === 0) {
                // Swap TOKEN_A to TOKEN_B
                path = [config.USDT_ADDRESS, config.USDC_ADDRESS];
                amountOutMin = 0; // Minimum amount of TOKEN_B to receive
            } else {
                // Swap TOKEN_B to TOKEN_A
                path = [config.USDC_ADDRESS, config.USDT_ADDRESS];
                amountOutMin = 0; // Minimum amount of TOKEN_A to receive
            }
            deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

            const tx = await uniswapRouter.swapExactTokensForTokens(AMOUNT_IN, amountOutMin, path, "wallet", deadline);
            await tx.wait(); // Wait for transaction to be confirmed
            console.log(`Swap transaction hash: ${tx.hash}`);

            // Check balance of the tokens after swap
            const balanceAfterA = await ethService.getErc20Balance(config.USDT_ADDRESS, "wallet");
            console.log(`Balance of TOKEN_A after swap ${i + 1}: ${balanceAfterA}`);
            const balanceAfterB = await ethService.getErc20Balance(config.USDC_ADDRESS, "wallet");
            console.log(`Balance of TOKEN_B after swap ${i + 1}: ${balanceAfterB}`);
        }
    } catch (error) {
        console.error('Error executing strategy:', error);
    }
}
