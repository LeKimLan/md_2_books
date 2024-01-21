import axios from 'axios'
import utils from '@utils'

export default {
    findAll: async function() {
        return await axios.get(`${import.meta.env.VITE_SERVER_HOST}/products`)
    },
    create: async function(data) {
        return await axios.post(`${import.meta.env.VITE_SERVER_HOST}/products`, data)
    },
    update: async function(id, data) {
        return await axios.patch(`${import.meta.env.VITE_SERVER_HOST}/products/${id}`, data)
    },
}