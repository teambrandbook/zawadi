import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8000/api"
})

export default api

export const getAccessToken = () => {
  const cookies = document.cookie.split("; ")
  const token = cookies.find(c => c.startsWith("access_token="))
  return token ? token.split("=")[1] : null
}