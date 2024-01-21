import axios from 'axios'
import utils from '@utils'
export default {
    findReceiptByUserId: async function(userId) {
        return await axios.get(`${import.meta.env.VITE_SERVER_HOST}/receipts?userId=${userId}`)
    },
    createReceipt: async function(newReceipt) {
        return await axios.post(`${import.meta.env.VITE_SERVER_HOST}/receipts`, newReceipt)
    },
    addToCart: async function(receiptId, patchData) {
        return await axios.patch(`${import.meta.env.VITE_SERVER_HOST}/receipts/${receiptId}`, patchData)
    }
}