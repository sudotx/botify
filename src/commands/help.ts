import { Bot } from 'grammy';

export const helpCommand = (bot: Bot) => {
    bot.command('help', (ctx) => {
        ctx.reply(`
Available commands:
/menu - Show main menu
/help - Show this help message
Use the menu buttons to:
- Connect your wallet
- Check your balance
- View available strategies
- Check your investment performance
    `);
    });
};