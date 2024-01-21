import axios from 'axios'
import utils from '@utils'

export default {
    findAll: async function () {
        return await axios.get(`${import.meta.env.VITE_SERVER_HOST}/categories?deleted=false`)
    },
    create: async function (data) {
        return await axios.post(`${import.meta.env.VITE_SERVER_HOST}/categories`, data)
    },
    update: async function (categoryId,data) {
        return await axios.patch(`${import.meta.env.VITE_SERVER_HOST}/categories/${categoryId}`, data)
    },
}