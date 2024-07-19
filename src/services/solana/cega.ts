import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export class cegaService {
    public cegaIDL
    public cegaProgramAddress

    private networkCluster: string = "devnet";
    private networkEndpoint;
    connection: Connection;

    constructor() {
        this.cegaIDL = {}
        this.cegaProgramAddress = new PublicKey("")

        this.networkEndpoint = (this.networkCluster == "mainnet-beta"
            ? process.env.RPC_MAINNET
            : process.env.RPC_DEVNET) as string;

        this.connection = new Connection(this.networkEndpoint, "recent")
    }

    deposit = async () => {
        let depositTransaction = new Transaction()
        let solTransferIx = SystemProgram.transfer(
            new PublicKey(1), new PublicKey(2), 0.1 * LAMPORTS_PER_SOL
        )
        depositTransaction.add(solTransferIx);
    }
}