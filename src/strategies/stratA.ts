import { ethers } from 'ethers';
import { EthService } from '../handlers/eth.handler';

const ethService = new EthService(`${process.env.ETH_RPC}`)

const UNISWAP_V2_ROUTER_ABI = [
    'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external returns (uint[] memory amounts)'
];
const UNISWAP_V2_ROUTER_ADDRESS = '0x5C69bEe701ef814a2b6A1b3eeb8d6c38F5d1f7e0';

const provider = ethService.initProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
const wallet = ethService.initWallet('YOUR_PRIVATE_KEY');

const TOKEN_A_ADDRESS = '0xTOKEN_A_ADDRESS'; // Address of token A
const TOKEN_B_ADDRESS = '0xTOKEN_B_ADDRESS'; // Address of token B (e.g., USDC)
const AMOUNT_IN = ethers.parseUnits('1', 18); // Amount of TOKEN_A to swap (e.g., 1 TOKEN_A)

const uniswapRouter = new ethers.Contract(UNISWAP_V2_ROUTER_ADDRESS, UNISWAP_V2_ROUTER_ABI, wallet!);

export async function performTokenTrade() {
    try {
        // Step 1: Check balance of TOKEN_A
        const balanceBefore = await ethService.getErc20Balance(TOKEN_A_ADDRESS, "wallet");
        console.log(`Balance before: ${balanceBefore}`);

        // Step 2: Approve Uniswap Router to spend TOKEN_A
        const tokenAContract = new ethers.Contract(TOKEN_A_ADDRESS, ['function approve(address spender, uint256 amount) external returns (bool)']);
        await tokenAContract.approve(UNISWAP_V2_ROUTER_ADDRESS, AMOUNT_IN);

        // Step 3: Perform the swap on Uniswap
        const path = [TOKEN_A_ADDRESS, TOKEN_B_ADDRESS]; // Path of the swap
        const amountOutMin = 0; // Minimum amount of TOKEN_B to receive (can be set dynamically)
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

        const tx = await uniswapRouter.swapExactTokensForTokens(AMOUNT_IN, amountOutMin, path, wallet, deadline);
        await tx.wait(); // Wait for transaction to be confirmed
        console.log(`Swap transaction hash: ${tx.hash}`);

        // Step 4: Check balance of TOKEN_B
        const balanceAfter = await ethService.getErc20Balance(TOKEN_B_ADDRESS, "wallet");
        console.log(`Balance after: ${balanceAfter}`);

    } catch (error) {
        console.error('Error executing strategy:', error);
    }
}
