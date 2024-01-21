import validateModule from './modules/validate.module'
import  hashModule from './modules/hash'
import  tokenModule from './modules/token'
import randomModule from './modules/random'
export default {
    validate: validateModule,
    hash: hashModule,
    token: tokenModule,
    random: randomModule
}