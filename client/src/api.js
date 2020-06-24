import axios from 'axios'

export const serverAddress = "localhost:5000";
export const baseURL = `http://${serverAddress}`;

const userReq = axios.create({ baseURL: `${baseURL}/user`, withCredentials: true})
const classReq = axios.create({ baseURL: `${baseURL}/class`, withCredentials: true})
const stockReq = axios.create({ baseURL: `${baseURL}/stock`,  withCredentials: true})
const userStockReq = axios.create({ baseURL: `${baseURL}/stock/user`,  withCredentials: true})
const txnReq = axios.create({ baseURL: `${baseURL}/txn`,  withCredentials: true})

// User
export const apiUser_login = data => userReq.post('/login', data)
export const apiUser_login_key = data => userReq.post('/loginKey', data)
export const apiUser_new = data => userReq.post('/new', data)
export const apiUser_get = () => userReq.post('/get')
export const apiUser_update = data => userReq.post('/update', data)
export const apiUser_account = data => userReq.post('/account', data)
export const apiUser_logout = () => userReq.post('/logout')

// Class
export const apiClass_announceList = () => classReq.get('/list')
export const apiClass_addAnnounce = data => classReq.post('/add_Announce', data)

// Stock
export const apiStock_list_all = () => stockReq.get('/get/all')
export const apiRank_list_all = () => stockReq.post('get/rank')

// User's Stock
export const apiUserStock_get = () => userStockReq.post('/get')
export const apiUserStock_track = data => userStockReq.post('/track', data)
export const apiUserStock_track_get = () => userStockReq.post('/track/get')
export const apiUserStock_buy = data => userStockReq.post('/order/buy', data)
export const apiUserStock_sell = data => userStockReq.post('/order/sell', data)

// Transaction
export const apiTxn_list_all = () => txnReq.post('get/all')
export const apiTxn_get_all = () => txnReq.post('get/user/all')
export const apiTxn_get_success = () => txnReq.post('get/user/success')
export const apiTxn_get_fail = () => txnReq.post('get/user/fail')
export const apiTxn_get_waiting = () => txnReq.post('get/user/waiting')
export const apiTxn_get_error = () => txnReq.post('get/user/error')
export const apiTxn_get_class_avg = () => txnReq.post('get/class/avg')
