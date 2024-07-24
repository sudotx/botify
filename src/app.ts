import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'

import { bot } from '@/helpers/bot'
import startMongo from '@/helpers/startMongo'
import attachUser from '@/middlewares/attachUser'
import { run } from '@grammyjs/runner'
import { ignoreOld, sequentialize } from 'grammy-middlewares'
import { checkBalanceCallback } from './callbacks/check_balances'
import { generateWalletCallback } from './callbacks/generate_wallet'
import { viewStrategiesCallback } from './callbacks/view_strategies'

const setupBot = () => {
  bot.use(sequentialize())
    .use(ignoreOld())
    .use(attachUser)

  bot.api.setMyCommands([
    { command: 'menu', description: 'Show main menu' },
    { command: 'help', description: 'Show help information' },
    { command: 'wallet', description: 'View your wallet address' },
    { command: 'invest', description: 'Invest in a strategy' },
  ])

  bot.catch(console.error)
}

const initializeCallbacks = () => {
  viewStrategiesCallback()
  generateWalletCallback()
  checkBalanceCallback()
}

const startBot = async () => {
  try {
    await startMongo()
    console.log('Database connected')

    setupBot()
    await bot.init()
    run(bot)

    initializeCallbacks()

    console.info('Up And Running')
  } catch (error) {
    console.error('Error during startup:', error)
  }
}

startBot()