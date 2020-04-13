import axios from 'axios'

export const serverAddress = "localhost:5000";
export const baseURL = `http://${serverAddress}`;

const userReq = axios.create({ baseURL: `${baseURL}/user`})
const classReq = axios.create({ baseURL: `${baseURL}/class`})

// User
export const apiUser_login = data => userReq.post('/login', data)
export const apiUser_new = data => userReq.post('/new', data)

// Class
export const apiClass_announceList = () => classReq.get('/list')
export const apiClass_addAnnounce = data => classReq.post('/add_Announce', data)
