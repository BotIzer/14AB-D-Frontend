import axios from 'axios'

export default axios.create({
    baseURL: import.meta.env.VITE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
})