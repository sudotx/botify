import { ethers } from "ethers";
import { constants, RpcProvider } from "starknet";
import { utils } from "zksync-ethers";

const myProvider = new RpcProvider({ nodeUrl: constants.NetworkName.SN_SEPOLIA });

class ekuboService {
    eigenABI = utils.CONTRACT_DEPLOYER
    constructor() { }
    deposit() {
        ethers
    }
    repay() {
        ethers
    }
}