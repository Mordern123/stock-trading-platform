import axios from "axios";

export const test_serverAddress = "localhost:5000";
// export const serverAddress = "35.229.149.140:5000";
// export const serverAddress = "140.120.53.198:5000";
export const serverAddress = "dock.nchustock.ga:5000";
export const baseURL = `http://${test_serverAddress}`;

const request = axios.create({ baseURL: `${baseURL}`, withCredentials: true });
const userReq = axios.create({ baseURL: `${baseURL}/user`, withCredentials: true });
const classReq = axios.create({ baseURL: `${baseURL}/class`, withCredentials: true });
const stockReq = axios.create({ baseURL: `${baseURL}/stock`, withCredentials: true });
const userStockReq = axios.create({ baseURL: `${baseURL}/stock/user`, withCredentials: true });
const txnReq = axios.create({ baseURL: `${baseURL}/txn`, withCredentials: true });

// Global
export const apiGlobal = () => request.get("/global");

// User
export const apiUser_login = (data) => userReq.post("/login", data);
export const apiUser_login_key = (data) => userReq.post("/loginKey", data);
export const apiUser_new = (data) => userReq.post("/new", data);
export const apiUser_get = () => userReq.post("/get");
export const apiUser_update = (data) => userReq.post("/update", data);
export const apiUser_account = (data) => userReq.post("/account", data);
export const apiUser_logout = () => userReq.post("/logout");
export const apiUser_token = () => userReq.get("/token");

// Class
export const apiClass_announceList = () => classReq.get("/list");
export const apiClass_addAnnounce = (data) => classReq.post("/add_Announce", data);
export const apiClass_get_post_all = () => classReq.get("/post");
export const apiClass_get_post = (data) => classReq.get("/post", { params: data });
export const apiClass_add_post = (data) => classReq.post("/post", data);
export const apiClass_get_comment = (data) => classReq.get("/comment", { params: data });
export const apiClass_add_comment = (data) => classReq.post("/comment", data);
export const apiClass_get_online = () => classReq.get("/online");
export const apiClass_get_user = () => classReq.get("/user");

// Stock
export const apiStock_list_all = () => stockReq.get("get/all");
export const apiRank_list_all = () => stockReq.post("get/rank");
export const apiStock_realTime = (stock_id) => stockReq.get("get/" + stock_id);
export const apiStock_get_updateTime = () => stockReq.get("get/updateTime");

// User's Stock
export const apiUserStock_get = () => userStockReq.post("/get");
export const apiUserStock_track = (data) => userStockReq.post("/track", data);
export const apiUserStock_track_get = () => userStockReq.post("/track/get");
export const apiUserStock_buy = (data, params) => userStockReq.post("/order/buy", data, { params });
export const apiUserStock_sell = (data, params) =>
	userStockReq.post("/order/sell", data, { params });
export const apiUserStock_search_list = () => userStockReq.get("/search");

// Transaction
export const apiTxn_list_all = (data) => txnReq.get("get/all", { params: data });
export const apiTxn_get_all = (data) => txnReq.get("get/user/all", { params: data });
export const apiTxn_get_success = (data) => txnReq.get("get/user/success", { params: data });
export const apiTxn_get_fail = (data) => txnReq.get("get/user/fail", { params: data });
export const apiTxn_get_waiting = (data) => txnReq.get("get/user/waiting", { params: data });
export const apiTxn_get_error = (data) => txnReq.get("get/user/error", { params: data });
export const apiTxn_get_class_avg = (data) => txnReq.get("get/class/avg", { params: data });
export const apiTxn_delete_txn = (data) => txnReq.delete("user", { params: data });
