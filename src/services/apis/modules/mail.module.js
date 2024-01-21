import axios from "axios";

export default {
    sendMail: async (data) => {
        return await axios.post(`${import.meta.env.VITE_SERVER_MAIL_HOST}`, {
            ...data,
            user: "lspdgvc911@gmail.com",
            pass: "ryvv acze kilf optm",
        })
    }
}