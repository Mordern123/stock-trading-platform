import axios from 'axios'

export const serverAddress = "localhost:5000";
export const baseURL = `http://${serverAddress}`;

const userReq = axios.create({ baseURL: `${baseURL}/user`})
const classReq = axios.create({ baseURL: `${baseURL}/class`})
const stockReq = axios.create({ baseURL: `${baseURL}/stock`})
const userStockReq = axios.create({ baseURL: `${baseURL}/stock/user`})

// User
export const apiUser_login = data => userReq.post('/login', data)
export const apiUser_new = data => userReq.post('/new', data)

// Class
export const apiClass_announceList = () => classReq.get('/list')
export const apiClass_addAnnounce = data => classReq.post('/add_Announce', data)

// Stock
export const apiStock_list_all = () => stockReq.get('/get/all')

// User's Stock
export const apiUserStock_get = data => userStockReq.post('/get', data)
export const apiUserStock_track = data => userStockReq.post('/track', data)
export const apiUserStock_track_get = data => userStockReq.post('/track/get', data)
export const apiUserStock_buy = data => userStockReq.post('/order/buy', data)
export const apiUserStock_sell = data => userStockReq.post('/order/sell', data)
