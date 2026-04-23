import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

const instance = axios.create({
    baseURL: 'http://106.14.236.60:5196/api',
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