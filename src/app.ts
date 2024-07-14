import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'

import sendHelp from '@/handlers/help'
import bot from '@/helpers/bot'
import i18n from '@/helpers/i18n'
import startMongo from '@/helpers/startMongo'
import languageMenu from '@/menus/language'
import attachUser from '@/middlewares/attachUser'
import configureI18n from '@/middlewares/configureI18n'
import { run } from '@grammyjs/runner'
import axios from 'axios'
import { InlineKeyboard } from 'grammy'
import { ignoreOld, sequentialize } from 'grammy-middlewares'

const mainMenu = new InlineKeyboard()
  .text('Get Neko Image', 'get_neko')
  .row()
  .text('Download Manga', 'download_manga')
  .row()
  .text('Trigger Something', 'download_manga')

// show the main menu
bot.command('menu', (ctx) => {
  ctx.reply('Welcome! Please choose an option:', {
    reply_markup: mainMenu
  });
});

async function runApp() {
  console.log('Starting app...')
  // Mongo
  await startMongo()
  console.log('Mongo connected')
  bot
    // Middlewares
    .use(sequentialize())
    .use(ignoreOld())
    .use(attachUser)
    .use(i18n.middleware())
    .use(configureI18n)
    // Menus
    .use(languageMenu)
  // Commands
  bot.command(['help', 'start'], sendHelp)
  // bot.command('language', handleLanguage)
  bot.command('earn', async (ctx) => {
    ctx.reply("Okay earning")

  })

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

  // Errors
  bot.catch(console.error)
  // Start bot
  await bot.init()
  run(bot)
  console.info(`Bot ${bot.botInfo.username} is up and running`)
}

void runApp()

const fetchNeko = async (): Promise<string> => {
  try {
    const response = await axios.get('https://nekos.pro/api/neko', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.url;
  } catch (error) {
    console.error('Error fetching neko image:', error);
    throw error;
  }

};
const getNsfwNeko = async (): Promise<string> => {
  try {
    const response = await axios.get('https://nekos.pro/api/neko', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.url;
  } catch (error) {
    console.error('Error fetching neko image:', error);
    throw error;
  }

};

