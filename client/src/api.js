import axios from 'axios'

export const test_serverAddress = "localhost:5000";
export const serverAddress = "192.168.0.6:5000";
export const baseURL = `http://${test_serverAddress}`;

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
export const apiStock_realTime = stock_id => stockReq.get('/get/' + stock_id)

// User's Stock
export const apiUserStock_get = () => userStockReq.post('/get')
export const apiUserStock_track = data => userStockReq.post('/track', data)
export const apiUserStock_track_get = () => userStockReq.post('/track/get')
export const apiUserStock_buy = data => userStockReq.post('/order/buy', data)
export const apiUserStock_sell = data => userStockReq.post('/order/sell', data)
export const apiUserStock_search_list = () => userStockReq.get('/search')

// Transaction
export const apiTxn_list_all = (data) => txnReq.get('get/all', { params: data })
export const apiTxn_get_all = (data) => txnReq.get('get/user/all', { params: data })
export const apiTxn_get_success = (data) => txnReq.get('get/user/success', { params: data })
export const apiTxn_get_fail = (data) => txnReq.get('get/user/fail', { params: data })
export const apiTxn_get_waiting = (data) => txnReq.get('get/user/waiting', { params: data })
export const apiTxn_get_error = (data) => txnReq.get('get/user/error', { params: data })
export const apiTxn_get_class_avg = (data) => txnReq.get('get/class/avg', { params: data })
