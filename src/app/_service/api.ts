import axios from 'axios'

export const baseUrl = 'http://127.0.0.1:8000/'

export type UrlParams = {
    endpoint: string
    token?: string
}

export type UpdateUrlParams = {
    body: any
} & UrlParams

export const apiGet = async (urlParams: UrlParams) => {
    const url = `${baseUrl}${urlParams.endpoint}/`
    const response = await axios.get(url, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: urlParams.token && `Bearer ${urlParams.token}`,
        },
    })
    return response.data
}

export const apiPost = async (urlParams: UpdateUrlParams) => {
    const url = `${baseUrl}${urlParams.endpoint}/`
    const response = await axios.post(
        url,
        { ...urlParams.body },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: urlParams.token && `Bearer ${urlParams.token}`,
            },
        },
    )
    return response.data
}

export const apiPostForFile = async (urlParams: UpdateUrlParams) => {
    const url = `${baseUrl}${urlParams.endpoint}/`
    const response = await axios.post(
        url,
        { ...urlParams.body },
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: urlParams.token && `Bearer ${urlParams.token}`,
            },
        },
    )
    return response.data
}

export const apiPut = async (urlParams: UpdateUrlParams) => {
    const url = `${baseUrl}${urlParams.endpoint}/`
    const response = await axios.put(
        url,
        { ...urlParams.body },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: urlParams.token && `Bearer ${urlParams.token}`,
            },
        },
    )
    return response.data
}

export const apiDelete = async (urlParams: UrlParams) => {
    const url = `${baseUrl}${urlParams.endpoint}/`
    const response = await axios.delete(url, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: urlParams.token && `Bearer ${urlParams.token}`,
        },
    })
    return response.data
}
