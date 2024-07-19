import { Connection, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, } from "@solana/web3.js";



class kaminoService {
    kaminoAddress = new PublicKey(1)
    // kaminoABI 
    connection = new Connection("https://api.devnet.solana.com")

    constructor() { }
    async send_sol() {
        const transferTransaction = new Transaction().add(
            // SystemProgram.transfer({
            //     fromPubkey: this.kaminoAddress.toBase58,
            //     toPubkey: this.kaminoAddress.toBase58,
            //     lamports: 1_000_000,
            // })
        );

        // await sendAndConfirmTransaction(this.connection, transferTransaction, [
        //     this.kaminoAddress,
        // ]);

    }
}