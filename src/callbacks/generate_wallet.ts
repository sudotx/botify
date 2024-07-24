import { fetchNeko } from '@/helpers/utils';
import { ethers } from 'ethers';
import { bot } from "../helpers/bot";
import { PublicKey } from '@solana/web3.js';
import { stark } from 'starknet';

export const generateWalletCallback = () => {
    bot.callbackQuery('generate_wallet', async (ctx) => {
        await ctx.reply("You already have a connected wallet.");

        // Generate a new wallet
        const wallet = ethers.Wallet.createRandom();

        const solanaWallet = new PublicKey("")

        const starknetWallet = stark.randomAddress()

        const imageUrl = await fetchNeko();

        await ctx.reply(imageUrl)
        await ctx.reply("Your wallet is now connected and ready to use.");
        await ctx.reply(
            `New wallet generated for you!\nAddress: ${wallet.address}\n\nIMPORTANT: Please store this recovery phrase safely and never share it:\n${wallet.mnemonic?.phrase}` +
            `New wallets generated for you!\n\n` +
            `Solana:\nPublic Key: ${solanaWallet.toBase58()}\n` +
            `Starknet:\nPrivate Key: ${starknetWallet}\n\n` +
            `IMPORTANT: Please store these recovery phrases and private keys safely and never share them!`
        );
        await ctx.answerCallbackQuery();
    });
};