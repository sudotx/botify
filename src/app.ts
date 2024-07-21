import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'

import bot from '@/helpers/bot'
import startMongo from '@/helpers/startMongo'
import attachUser from '@/middlewares/attachUser'
import { run } from '@grammyjs/runner'
import { ignoreOld, sequentialize } from 'grammy-middlewares'

bot.api.setMyCommands([
  { command: 'menu', description: 'Show main menu' },
  { command: 'help', description: 'Show help information' },
  { command: 'wallet', description: 'View your wallet address' },
  { command: 'invest', description: 'Invest in a strategy' },
]);

(async function () {
  try {
    await startMongo().then(() => {
      console.log('Database connected')
    }).finally(() => {
      console.log('Starting up...')
    })

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