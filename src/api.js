import axios from 'axios'

const api = axios.create({
  baseURL: 'https://backup-endpoints.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api