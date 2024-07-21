import "dotenv"

export default {
    environment: process.env.NODE_ENV || "development",
    logLevel: process.env.LOG_LEVEL || "info",
    ethereum: {
        rpcUrl: process.env.RPC_URL || "http://localhost:8545",
        privateKey: process.env.PRIVATE_KEY || "",
    },
    solana: {
        cluster: process.env.SOLANA_CLUSTER || "devnet",
        endpoint: process.env.SOLANA_ENDPOINT || "http://localhost:8899",
        wallet: {
            privateKey: process.env.SOLANA_WALLET_PRIVATE_KEY || "",
            publicKey: process.env.SOLANA_WALLET_PUBLIC_KEY || ""
        },
        telegram: {
            token: process.env.TELEGRAM_TOKEN || "",
            chatId: process.env.TELEGRAM_CHAT_ID || ""
        }
    },
    strategies: [
        { id: 1, name: "Deposit USDC to Aave" },
        { id: 2, name: "Create ETH-USDC LP on Uniswap" },
        { id: 3, name: "Swap ETH to USDC on 1inch" },
    ],
    UNISWAP_V2_ROUTER_ADDRESS: "0x5C69bEe701ef814a2b6A1b3eeb8d6c38F5d1f7e0",
    UNISWAP_V2_ROUTER_ABI: [
        'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external returns (uint[] memory amounts)',
        'function approve(address spender, uint256 amount) external returns (bool)'
    ],
    USDC_ADDRESS: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    USDT_ADDRESS: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
}