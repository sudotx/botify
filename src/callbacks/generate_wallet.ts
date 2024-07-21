import { fetchNeko } from '@/helpers/utils';
import { ethers } from 'ethers';
import { Bot } from 'grammy';

export const viewStrategiesCallback = (bot: Bot) => {
    bot.callbackQuery('generate_wallet', async (ctx) => {
        await ctx.reply("You already have a connected wallet.");

        // Generate a new wallet
        const wallet = ethers.Wallet.createRandom();

        const imageUrl = await fetchNeko();

        await ctx.reply(imageUrl)
        await ctx.reply(`New wallet generated for you!\nAddress: ${wallet.address}\n\nIMPORTANT: Please store this recovery phrase safely and never share it:\n${wallet.mnemonic?.phrase}`);
        await ctx.reply("Your wallet is now connected and ready to use.");
        await ctx.answerCallbackQuery();
    });
};