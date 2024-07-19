import "dotenv"

module.exports = {
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
    }
}