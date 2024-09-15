import axios from 'axios'

export const apiGet = async (endpoint: string, token?: string) => {
    const response = await axios.get(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: token && `Bearer ${token}`,
        },
    })
    return response.data
}

export const apiPost = async <T>(endpoint: string, body: T, token?: string) => {
    const response = await axios.post(
        endpoint,
        { ...body },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token && `Bearer ${token}`,
            },
        },
    )
    return response
}

export const apiPostForFile = async <T>(
    endpoint: string,
    body: T,
    token?: string,
) => {
    const response = await axios.post(
        endpoint,
        { ...body },
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: token && `Bearer ${token}`,
            },
        },
    )
    return response
}

export const apiPut = async <T>(endpoint: string, body: T, token: string) => {
    const response = await axios.put(
        endpoint,
        { ...body },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token && `Bearer ${token}`,
            },
        },
    )
    return response
}

export const apiDelete = async (endpoint: string, token: string) => {
    const response = axios.delete(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: token && `Bearer ${token}`,
        },
    })
    return response
}
