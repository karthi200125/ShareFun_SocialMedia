import axios from 'axios'

export const apiRequest = axios.create({
    baseURL:"http://localhost:8800/"
})