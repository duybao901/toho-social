import axios from 'axios'

export const getDataAPI = async (url, token) => {
    const res = await axios.get(`/api/${url}`, {
        headers: {
            Authorization: token
        }
    })
    return res;
}

export const postDataAPI = async (url, post, token) => {
    console.log(url, post)
    const res = await axios.post(`/api/${url}`, post, {
        headers: {
            Authorization: token
        }
    })
    return res;
}


export const putDataAPI = async (url, post, token) => {
    const res = await axios.put(`/api/${url}`, post, {
        headers: {
            Authorization: token
        }
    })
    return res;
}

export const deleteDataAPI = async (url, token) => {
    const res = await axios.delete(`/api/${url}`, {
        headers: {
            Authorization: token
        }
    })
    return res;
}