import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'

import sendHelp from '@/handlers/help'
import handleLanguage from '@/handlers/language'
import bot from '@/helpers/bot'
import i18n from '@/helpers/i18n'
import startMongo from '@/helpers/startMongo'
import languageMenu from '@/menus/language'
import attachUser from '@/middlewares/attachUser'
import configureI18n from '@/middlewares/configureI18n'
import { run } from '@grammyjs/runner'
import { ignoreOld, sequentialize } from 'grammy-middlewares'
import axios from 'axios'

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
  bot.command('language', handleLanguage)
  bot.command('earn', () => { console.log("Earn Clicked") })
  bot.command('download', async (ctx) => {
    const mangaName = ctx.message?.text?.split(' ').slice(1).join(' ');
    if (!mangaName) {
      ctx.reply('Please provide a manga name.');
      return;
    }

    try {
      const mangaData = await fetchManga(mangaName);
      if (mangaData.data.length === 0) {
        ctx.reply('Manga not found.');
        return;
      }

      const manga = mangaData.data[0];
      ctx.reply(`Found: ${manga.attributes.title.en}`);
      // Add code to download and send manga files
    } catch (error) {
      ctx.reply('An error occurred while fetching manga.');
    }
  });
  // Errors
  bot.catch(console.error)
  // Start bot
  await bot.init()
  run(bot)
  console.info(`Bot ${bot.botInfo.username} is up and running`)
}

void runApp()
const fetchManga = async (mangaName: string) => {
  const response = await axios.get(`https://api.mangadex.org/manga?title=${mangaName}`);
  console.log(response);
  return response.data;
};

