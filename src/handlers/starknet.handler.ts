import { Contract, JsonRpcProvider, Wallet } from 'ethers';
// import { starknet } from 'starknet';

const starknetRpcUrl = process.env.STARKNET_RPC_URL as string;

export const initStarkNetConnection = () => {
    return new JsonRpcProvider(starknetRpcUrl);
};

export const createStarkNetWallet = () => {
    return Wallet.createRandom();
};

export const getStarkNetTokenBalance = async (
    address: string,
    tokenAddress: string,
    provider: JsonRpcProvider
): Promise<string> => {
    const erc20Abi = [
        "function balanceOf(address owner) view returns (uint256)"
    ];
    const contract = new Contract(tokenAddress, erc20Abi, provider);
    const balance = await contract.balanceOf(address);
    // return ethers.utils.formatUnits(balance, 18); // Assuming the token has 18 decimals
    return ""
};

export const sendStarkNetTransaction = async (
    fromWallet: Wallet,
    to: string,
    amountInTokens: number,
    tokenAddress: string,
    provider: JsonRpcProvider
): Promise<string> => {
    const erc20Abi = [
        "function transfer(address to, uint amount) returns (bool)"
    ];
    const contract = new Contract(tokenAddress, erc20Abi, fromWallet);

    // const tx = await contract.transfer(to, ethers.utils.parseUnits(amountInTokens.toString(), 18)); // Assuming the token has 18 decimals
    // await tx.wait();
    // return tx.hash;
    return ""
};