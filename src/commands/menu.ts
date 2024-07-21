import { InlineKeyboard } from "grammy";
import { bot } from "../helpers/bot";

export const menuCommand = () => {
    bot.command('menu', (ctx) => {
        const mainMenu = new InlineKeyboard()
            .text('Check Balance', 'check_balance')
            .row()
            .text('View Strategies', 'view_strategies')

        ctx.reply('Welcome! Please choose an option:', {
            reply_markup: mainMenu
        });
    });
};