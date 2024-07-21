import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

// Initialize a Solana connection
export const initConnection = (rpcUrl: string) => {
    return new Connection(rpcUrl, 'recent');
};

export const getSolBalance = async (address: string, connection: Connection): Promise<string> => {
    const balance = await connection.getBalance(new PublicKey(address));
    return (balance / LAMPORTS_PER_SOL).toString();
};

export const sendSolTransaction = async (
    fromWallet: string,
    to: string,
    amountInSol: number,
    connection: Connection
): Promise<Transaction> => {
    const transaction = new Transaction().add(
        SystemProgram.transfer(
            new PublicKey(fromWallet),
            new PublicKey(to),
            amountInSol * LAMPORTS_PER_SOL,
        )
    );

    return transaction
};