import "dotenv/config";

const config = {
    environment: process.env.NODE_ENV || "development",
    logLevel: process.env.LOG_LEVEL || "info",

    networks: {
        ethereum: {
            rpcUrl: process.env.ETH_RPC_URL || "http://localhost:8545",
            privateKey: process.env.ETH_PRIVATE_KEY || "",
        },
        solana: {
            cluster: process.env.SOLANA_CLUSTER || "devnet",
            endpoint: process.env.SOLANA_ENDPOINT || "http://localhost:8899",
            wallet: {
                privateKey: process.env.SOLANA_WALLET_PRIVATE_KEY || "",
                publicKey: process.env.SOLANA_WALLET_PUBLIC_KEY || ""
            },
        },
    },

    telegram: {
        token: process.env.TELEGRAM_TOKEN || "",
        chatId: process.env.TELEGRAM_CHAT_ID || ""
    },

    tokens: {
        USDC: {
            ethereum: {
                address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                decimals: 6
            },
            polygon: {
                address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                decimals: 6
            },
            solana: {
                address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                decimals: 6
            },
            // Add more chains as needed
        },
        USDT: {
            ethereum: {
                address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
                decimals: 6
            },
            // Add more chains as needed
        },
    },

    strategies: [
        { id: 1, name: "Deposit USDC to Aave" },
        { id: 2, name: "Create ETH-USDC LP on Uniswap" },
        { id: 3, name: "Swap ETH to USDC on 1inch" },
    ],

    uniswap: {
        v2: {
            routerAddress: "0x5C69bEe701ef814a2b6A1b3eeb8d6c38F5d1f7e0",
            routerABI: [
                'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external returns (uint[] memory amounts)',
                'function approve(address spender, uint256 amount) external returns (bool)'
            ],
        },
    },
};

export default config;
