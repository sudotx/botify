import { connect } from 'mongoose'
import env from '@/helpers/env'

function startDatabase() {
  return connect(env.MONGO)
}

export default startDatabase
