import strategies from '../config';
import { bot } from "../helpers/bot";

export const viewStrategiesCallback = () => {
    bot.callbackQuery('view_strategies', async (ctx) => {
        const strategyList = strategies.strategies.map(s => `${s.id}. ${s.name}`).join('\n');
        await ctx.reply(`Available strategies:\n${strategyList}\n\nTo invest, use /invest <strategy_id> <amount>`);
        await ctx.answerCallbackQuery();
    });
};