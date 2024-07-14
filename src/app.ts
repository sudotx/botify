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

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                            MENU                            */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

const mainMenu = new InlineKeyboard()
  .text('Get Neko Image', 'get_neko')
  .row()
  .text('Get NSFW Image', 'get_nsfw_neko')
  .row()
  .text('Start Earning', 'earn')

// show the main menu
bot.command('menu', (ctx) => {
  ctx.reply('Welcome! Please choose an option:', {
    reply_markup: mainMenu
  });
});



/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                          MAIN APP                          */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/


async function runApp() {
  console.log('Starting up...')

  await startMongo().then(
    () => {
      console.log('Mongo connected')
    }
  )
  bot
    .use(sequentialize())
    .use(ignoreOld())
    .use(attachUser)


  /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
  /*                       MENU FUNCTIONS                       */
  /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

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

  bot.catch(console.error)
  await bot.init()
  run(bot)
  console.info(`Up And Running`)
}

void runApp()



