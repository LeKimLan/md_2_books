import axios from 'axios'
import utils from '@utils'

export default {
    findAccount: async function () {
        return await axios.get(`${import.meta.env.VITE_SERVER_HOST}/users`)
    }
}