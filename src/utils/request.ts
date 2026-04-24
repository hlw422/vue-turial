import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000
})

instance.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json'
    return config
})

instance.interceptors.response.use((response) => { return response.data }, (error) => { return Promise.reject(error) })

function request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return instance.request(config)
}

export default request