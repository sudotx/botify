import { Bot, InlineKeyboard } from "grammy";

export const menuCommand = (bot: Bot) => {
    bot.command('menu', (ctx) => {
        const mainMenu = new InlineKeyboard()
            .text('Connect Wallet', 'connect_wallet')
            .row()
            .text('Check Balance', 'check_balance')
            .row()
            .text('View Strategies', 'view_strategies')
            .row()
            .text('Performance', 'performance');

        ctx.reply('Welcome! Please choose an option:', {
            reply_markup: mainMenu
        });
    });
};