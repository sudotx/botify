import { ethers } from "ethers";


export class ethereumService {
    constructor() { }

    web3 = new ethers.JsonRpcProvider("")

    init() {
        console.log("ethereum service init")
    }

    async getBalance(address: string) {
        const balance = await this.web3.getBalance(address)
        console.log("balance", balance)
    }

    async getBlockNumber() {
        const blockNumber = await this.web3.getBlockNumber()
        console.log("blockNumber", blockNumber)
    }

    async getTransactionCount(address: string) {
        const transactionCount = await this.web3.getTransactionCount(address)
        console.log("transactionCount", transactionCount)
    }

    async sendTransaction(to: string, value: number) {
        const transaction = {
            to: to,
            value: ethers.parseEther(value.toString())
        }
        // const tx = await web3.sendTransaction(transaction)
        // console.log("tx", tx)
    }

    async getTransaction(hash: string) {
        const tx = await this.web3.getTransaction(hash)
        console.log("tx", tx)
    }

    async getTransactionReceipt(hash: string) {
        const tx = await this.web3.getTransactionReceipt(hash)
        console.log("tx", tx)
    }

    async getLogs(address: string) {
        const logs = await this.web3.getLogs({
            address: address
        })
        console.log("logs", logs)
    }

    async getLogsFromBlock(address: string, blockNumber: number) {
        const logs = await this.web3.getLogs({
            address: address,
            fromBlock: blockNumber
        })
        console.log("logs", logs)
    }

    async getLogsFromBlockToBlock(address: string, fromBlock: number, toBlock: number) {
        const logs = await this.web3.getLogs({
            address: address,
            fromBlock: fromBlock,
            toBlock: toBlock
        })
        console.log("logs", logs)
    }
}