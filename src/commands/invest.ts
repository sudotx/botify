import { Bot } from 'grammy';
import { ethers } from 'ethers';
import strategies from '../config';


export const investCommand = (bot: Bot) => {
    bot.command('invest', async (ctx) => {
        if (!ctx.message || !ctx.message.text) {
            return ctx.reply("Invalid command format.");
        }

        const parts = ctx.message.text.split(' ');
        if (parts.length !== 3) {
            return ctx.reply("Invalid format. Use: /invest <strategy_id> <amount>");
        }

        const strategyId = Number(parts[1]);
        const amount = Number(parts[2]);

        if (isNaN(strategyId) || isNaN(amount)) {
            return ctx.reply("Invalid strategy ID or amount.");
        }

        const strategy = strategies.strategies.find((s: { id: number; }) => s.id === strategyId);
        if (!strategy) {
            return ctx.reply("Invalid strategy ID.");
        }

        ctx.reply(`Simulating investment of ${amount} USDC in strategy: ${strategy.name}`);
        const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
        const wallet = new ethers.Wallet("ctx.session.walletPrivateKey", provider);

        try {
            const tx = await wallet.sendTransaction({
                to: "strategyAddress",
                value: ethers.parseUnits(amount.toString(), 'usdc'), // Assuming amount is in USDC
            });
            await ctx.reply(`Investment successful! Transaction hash: ${tx.hash}`);
        } catch (error) {
            console.error('Investment error:', error);
            await ctx.reply('An error occurred while processing your investment.');
        }
    });
};