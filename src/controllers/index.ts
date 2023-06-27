import axios from "axios";

const url = import.meta.env.VITE_API_URL
const apiKey =  import.meta.env.VITE_API_KEY

const controller = axios.create({
    baseURL: url,
    headers: {'x-api-key': apiKey, "Accept": "*/*, application/json, text/plain", }
})

export default controller