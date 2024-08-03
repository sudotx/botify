import { I18nContext } from '@grammyjs/i18n/dist/source';
import { User } from '@prisma/client';
import { Context as BaseContext } from 'grammy';

interface SessionData {
  walletAddress?: string;
  walletPrivateKey?: string;
}

class Context extends BaseContext {
  readonly i18n!: I18nContext
  dbuser!: User

  replyWithLocalization: this['reply'] = (text, other, ...rest) => {
    text = this.i18n.t(text)
    return this.reply(text, other, ...rest)
  }
}

export default Context
