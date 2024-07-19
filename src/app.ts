import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'

import bot from '@/helpers/bot'
import startMongo from '@/helpers/startMongo'
import attachUser from '@/middlewares/attachUser'
import { run } from '@grammyjs/runner'
import { InlineKeyboard } from 'grammy'
import { ignoreOld, sequentialize } from 'grammy-middlewares'
import { fetchNeko, getNsfwNeko } from './helpers/utils'

const mainMenu = new InlineKeyboard()
  .text('Connect Wallet', 'connect_wallet')
  .row()
  .text('Check Balance', 'check_balance')
  .row()
  .text('View Strategies', 'view_strategies')
  .row()
  .text('Performance', 'performance');

bot.api.setMyCommands([
  { command: 'menu', description: 'Show main menu' },
  { command: 'help', description: 'Show help information' },
  { command: 'wallet', description: 'View your wallet address' },
  { command: 'invest', description: 'Invest in a strategy' },
]);

const strategies = [
  { id: 1, name: "Deposit USDC to Aave" },
  { id: 2, name: "Create ETH-USDC LP on Uniswap" },
  { id: 3, name: "Swap ETH to USDC on 1inch" },
];

bot.command('menu', (ctx) => {
  ctx.reply('Welcome! Please choose an option:', {
    reply_markup: mainMenu
  });
});

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

bot.command('invest', async (ctx) => {
  // if (!ctx.session.walletAddress) {
  //   return ctx.reply("Please connect your wallet first using the menu.");
  // }

  // const parts = ctx.message.text.split(' ');
  // if (parts.length !== 3) {
  //   return ctx.reply("Invalid format. Use: /invest <strategy_id> <amount>");
  // }

  // const strategyId = Number(parts[1]);
  // const amount = Number(parts[2]);

  // if (isNaN(strategyId) || isNaN(amount)) {
  //   return ctx.reply("Invalid strategy ID or amount.");
  // }

  // const strategy = strategies.find(s => s.id === strategyId);
  // if (!strategy) {
  //   return ctx.reply("Invalid strategy ID.");
  // }

  // // Here you would implement the actual investment logic
  // ctx.reply(`Simulating investment of ${amount} USDC in strategy: ${strategy.name}`);
  // Implement actual blockchain interaction here
});

bot.command('invest', async (ctx) => {
  // if (!ctx.session.walletAddress || !ctx.session.walletPrivateKey) {
  //   return ctx.reply("You don't have a connected wallet. Use the 'Connect Wallet' option to create one.");
  // }

  // const parts = ctx.message.text.split(' ');
  // if (parts.length !== 3) {
  //   return ctx.reply("Invalid format. Use: /invest <strategy_id> <amount>");
  // }

  // const strategyId = Number(parts[1]);
  // const amount = Number(parts[2]);

  // if (isNaN(strategyId) || isNaN(amount)) {
  //   return ctx.reply("Invalid strategy ID or amount.");
  // }

  // const strategy = strategies.find(s => s.id === strategyId);
  // if (!strategy) {
  //   return ctx.reply("Invalid strategy ID.");
  // }

  // Here you would implement the actual investment logic
  // You can use ctx.session.walletAddress and ctx.session.walletPrivateKey to sign transactions
  // const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
  // const wallet = new ethers.Wallet(ctx.session.walletPrivateKey, provider);

  // ctx.reply(`Simulating investment of ${amount} USDC in strategy: ${strategy.name} from wallet ${wallet.address}`);
  // Implement actual blockchain interaction here using the wallet
});

bot.command('wallet', async (ctx) => {
  // if (ctx.session.walletAddress) {
  //   await ctx.reply(`Your wallet address: ${ctx.session.walletAddress}`);
  // } else {
  //   await ctx.reply("You don't have a connected wallet. Use the 'Connect Wallet' option to create one.");
  // }
});

bot.callbackQuery('get_neko', async (ctx) => {
  try {
    const imageUrl = await fetchNeko();

    await ctx.reply(imageUrl)
  } catch (error) {
    await ctx.reply('An error occurred while fetching the neko image.');
  }
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('get_nsfw_neko', async (ctx) => {
  try {
    const imageUrl = await getNsfwNeko();

    await ctx.reply(imageUrl)
  } catch (error) {
    await ctx.reply('An error occurred while fetching the neko image.');
  }
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('earn', async (ctx) => {
  try {
    ctx.reply("Okay earning")
  } catch (error) {
    await ctx.reply('An Error Occurred While Earning.');
  }
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('connect_wallet', async (ctx) => {
  // ctx.session.awaitingWalletAddress = true;
  // await ctx.reply("Please send your Ethereum wallet address.");
  // await ctx.answerCallbackQuery();
});

bot.callbackQuery('check_balance', async (ctx) => {
  // if (!ctx.session.walletAddress) {
  //   await ctx.reply("Please connect your wallet first.");
  //   await ctx.answerCallbackQuery();
  //   return;
  // }

  // const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
  // try {
  //   const balance = await provider.getBalance(ctx.session.walletAddress);
  //   await ctx.reply(`Your ETH balance: ${ethers.utils.formatEther(balance)} ETH`);
  // } catch (error) {
  //   await ctx.reply('An error occurred while fetching your balance.');
  // }
  // await ctx.answerCallbackQuery();
});

bot.callbackQuery('view_strategies', async (ctx) => {
  const strategyList = strategies.map(s => `${s.id}. ${s.name}`).join('\n');
  await ctx.reply(`Available strategies:\n${strategyList}\n\nTo invest, use /invest <strategy_id> <amount>`);
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('performance', async (ctx) => {
  // For MVP, we'll just return a placeholder message
  await ctx.reply("Performance tracking is coming soon!");
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('connect_wallet', async (ctx) => {
  //   if (ctx.session.walletAddress) {
  //     await ctx.reply("You already have a connected wallet.");
  //   } else {
  //     // Generate a new wallet
  //     const wallet = ethers.Wallet.createRandom();

  //     ctx.session.walletAddress = wallet.address;
  //     ctx.session.walletPrivateKey = wallet.privateKey;

  //     await ctx.reply(`New wallet generated for you!\nAddress: ${wallet.address}\n\nIMPORTANT: Please store this recovery phrase safely and never share it:\n${wallet.mnemonic.phrase}`);
  //     await ctx.reply("Your wallet is now connected and ready to use.");
  //   }
  //   await ctx.answerCallbackQuery();
});

bot.on('message:text', async (ctx) => {
  // if (ctx.session.awaitingWalletAddress) {
  //   if (ethers.utils.isAddress(ctx.message.text)) {
  //     ctx.session.walletAddress = ctx.message.text;
  //     ctx.session.awaitingWalletAddress = false;
  //     await ctx.reply(`Wallet connected: ${ctx.session.walletAddress}`);
  //   } else {
  //     await ctx.reply("Invalid address. Please send a valid Ethereum address.");
  //   }
  // }
});

(async function () {
  console.log('Starting up...')

  try {
    await startMongo()
    console.log('Database connected')

    bot
      .use(sequentialize())
      .use(ignoreOld())
      .use(attachUser)

    bot.catch(console.error)
    await bot.init()
    run(bot)

    console.info(`Up And Running`)
  } catch (error) {
    console.error('Error during startup:', error)
  }
})();