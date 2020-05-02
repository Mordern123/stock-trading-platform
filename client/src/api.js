import axios from 'axios'

export const serverAddress = "localhost:5000";
export const baseURL = `http://${serverAddress}`;

const userReq = axios.create({ baseURL: `${baseURL}/user`})
const classReq = axios.create({ baseURL: `${baseURL}/class`})
const stockReq = axios.create({ baseURL: `${baseURL}/stock`})
const userStockReq = axios.create({ baseURL: `${baseURL}/stock/user`})
const txnReq = axios.create({ baseURL: `${baseURL}/txn`})

// User
export const apiUser_login = data => userReq.post('/login', data)
export const apiUser_new = data => userReq.post('/new', data)
export const apiUser_account = data => userReq.post('/account', data)

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

// Transaction
export const apiTxn_list_all = () => txnReq.post('get/all')
export const apiTxn_get_success = data => txnReq.post('get/user/success', data)
export const apiTxn_get_fail = data => txnReq.post('get/user/fail', data)
export const apiTxn_get_waiting = data => txnReq.post('get/user/waiting', data)
export const apiTxn_get_error = data => txnReq.post('get/user/error', data)
