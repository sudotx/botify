import { Bot } from 'grammy'
import Context from '@/models/Context'
import env from '@/helpers/env'

export const bot = new Bot<Context>(env.TOKEN, {
  ContextConstructor: Context,
})
