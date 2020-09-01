import React, { useState, useEffect, useRef, Fragment, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router";
import { InputBase, IconButton, Divider, Paper, Button } from "@material-ui/core";
import { Search, ShowChart, AccountBalanceRounded, LocalAtmRounded } from "@material-ui/icons";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Material_Table from "components/Table/Material_Table";
import BuyDialog from "components/Transaction/Dialog_Buy";
import CardStat from "components/Transaction/Card_Stat";
import Backdrop from "@material-ui/core/Backdrop";
import LaunchRoundedIcon from "@material-ui/icons/LaunchRounded";
import AccountBoxRoundedIcon from "@material-ui/icons/AccountBoxRounded";
import {
	apiUserStock_track_get,
	apiUserStock_get,
	apiUser_account,
	apiStock_realTime,
	apiUserStock_search_list,
} from "../api";
import { useSnackbar } from "notistack";
import moment from "moment";
import { handle_error } from "../tools";
import LinearProgress from "@material-ui/core/LinearProgress";
import delay from "delay";
import copy from "clipboard-copy";

//提醒教學資訊
const tips = [
	"貼心提醒: 開盤時間，下訂單後40分鐘會處理交易",
	"貼心提醒: 搜尋股價請確定金額在下單喔",
	"貼心提醒: 若即時股價有誤可嘗試重新搜尋喔",
	"貼心提醒: 【交易狀態】可以取消未處理訂單喔",
	"貼心提醒: 收盤後訂單會在美每日8:00和15:00處理",
	"貼心提醒: 股票總價值是每日更新的喔",
];

//bubble sort
const customSort = (a, b, field) => {
	let pureS1 = a[field].replace(/,/g, "");
	let pureS2 = b[field].replace(/,/g, "");
	let n1 = isNaN(parseFloat(pureS1)) ? 0 : parseFloat(pureS1);
	let n2 = isNaN(parseFloat(pureS2)) ? 0 : parseFloat(pureS2);
	return n1 - n2;
};

const stock_columns = [
	{
		field: "stock_id",
		title: "證券代號",
	},
	{
		field: "stock_name",
		title: "證券名稱",
	},
	{
		field: "z",
		title: "成交價",
		customSort: (a, b) => customSort(a, b, "z"),
	},
	{
		field: "ud",
		title: "漲跌",
		customSort: (a, b) => customSort(a, b, "ud"),
	},
	{
		field: "v",
		title: "累積成交量",
		customSort: (a, b) => customSort(a, b, "v"),
	},
	{
		field: "o",
		title: "開盤",
		customSort: (a, b) => customSort(a, b, "o"),
	},
	{
		field: "h",
		title: "當日最高",
		customSort: (a, b) => customSort(a, b, "h"),
	},
	{
		field: "l",
		title: "當日最低",
		customSort: (a, b) => customSort(a, b, "l"),
	},
	{
		field: "y",
		title: "昨收",
		customSort: (a, b) => customSort(a, b, "y"),
	},
	{
		field: "request_time",
		title: "查詢時間",
	},
];

const styles = (theme) => ({
	text: {
		fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
	},
	searchBox: {
		padding: "2px 4px",
		display: "flex",
		alignItems: "center",
		width: "100%",
	},
	searchInput: {
		"& input": {
			[theme.breakpoints.up("sm")]: {
				fontSize: "1em",
			},
			[theme.breakpoints.down("sm")]: {
				fontSize: "0.7em",
			},
			textAlign: "center",
			fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
		},
		marginLeft: theme.spacing(1),
		flex: 1,
		height: "80px",
		fontSize: "xx-large",
	},
	divider: {
		height: "50px",
		margin: 4,
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: "#fff",
	},
	linearProgress: {
		"& div": {
			backgroundColor: "#ffb74d",
		},
		backgroundColor: "#fffce8",
		width: "50%",
	},
});

const useStyles = makeStyles(styles);

export const StockBuy = function() {
	const searchRef = useRef();
	const classes = useStyles();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const [searchText, set_searchText] = useState("");
	const [userStock, set_userStock] = useState(null);
	const [userTrack, set_userTrack] = useState(null);
	const [loading, setLoading] = useState(false);
	const [showBuyDialog, set_showBuyDialog] = useState(false);
	const [stockInfo, set_stockInfo] = useState(null);
	const [account, setAccount] = useState(null);
	const [userHistory, set_userHistory] = useState([]);
	const [update, set_update] = useState(false);
	const [blocking, set_blocking] = useState(false);
	const [random_n, set_random_n] = useState(Math.floor(Math.random() * tips.length));
	const history = useHistory();
	const location = useLocation();

	const handleCloseStockBuy = () => {
		set_showBuyDialog(false);
	};

	const onChange = () => {
		let text = searchRef.current.childNodes[0].value;
		set_searchText(text.trim()); //拿InputBase裡面的Input
	};

	//處理搜尋股票
	const handle_search_stock = async () => {
		try {
			//防呆
			set_blocking(true);
			if (!searchText) {
				alert("請輸入股票代號");
				set_blocking(false);
				return;
			}

			let res1 = await apiStock_realTime(searchText);
			await delay(2000);

			if (res1.status === 200) {
				let res2 = await apiUserStock_get();
				let res3 = await apiUserStock_track_get();
				if (res2.status === 200 && res3.status === 200) {
					let userHas = res2.data.find((item) => item.stock_id === res1.data.stock_id);
					let userTrack = res3.data.find((item) => item.stock_id === res1.data.stock_id);
					set_userStock(userHas);
					set_userTrack(userTrack);
					set_stockInfo(res1.data);
					set_showBuyDialog(true);
				}
			} else if (res1.status === 204) {
				alert("查無此股票");
			} else if (res1.status === 205) {
				alert("收盤中不可交易");
			}
		} catch (error) {
			handle_error(error, history);
		}
		set_blocking(false);
	};

	const handle_keyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handle_search_stock();
		}
	};

	const addTimeSnack = (msg, color) => {
		enqueueSnackbar(msg, {
			variant: color,
			anchorOrigin: { horizontal: "center", vertical: "top" },
			ContentProps: {
				style: {
					backgroundColor: "#3f51b5",
					color: "white",
				},
				className: classes.text,
			},
			action: (key) => (
				<Button style={{ color: "white" }} onClick={() => closeSnackbar(key)}>
					OK
				</Button>
			),
		});
	};

	const addCopySnack = () => {
		enqueueSnackbar("已複製剪貼簿", {
			variant: "copy",
			anchorOrigin: { horizontal: "center", vertical: "top" },
			ContentProps: {
				style: {
					color: "#F5F5F5",
				},
				className: classes.text,
			},
			autoHideDuration: 2000,
			action: (key) => (
				<Button style={{ color: "white" }} onClick={() => closeSnackbar(key)}>
					OK
				</Button>
			),
		});
	};

	const copy_stock = (e, row) => {
		copy(row.stock_id);
		set_searchText(row.stock_id);
		addCopySnack();
	};

	//取得帳戶資訊
	React.useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			try {
				const account_res = await apiUser_account();
				setAccount(account_res.data);
			} catch (error) {
				handle_error(error, history);
			}

			setLoading(false);
		};
		loadData();
		// addTimeSnack(`股票更新時間：${moment().calendar(null, { lastWeek: 'dddd HH:mm' })}`, 'info')
	}, []);

	//取得搜尋紀錄
	React.useEffect(() => {
		const load = async () => {
			let res = await apiUserStock_search_list();
			if (res.status === 200) {
				set_userHistory(res.data);
			}
		};
		load();
	}, []);

	//檢查是否透過跳轉過來
	React.useEffect(() => {
		if (location.state) {
			if (location.state.stock_id) {
				set_searchText(location.state.stock_id);
			}
		}
	}, []);

	return (
		<Fragment>
			<GridContainer>
				<GridItem xs={12} sm={6} md={6}>
					<CardStat
						title="目前總資產"
						updateTime={account ? `${account.last_update} 更新` : "更新中..."}
						value={account ? account.balance : 0}
						color="success"
						icon={<AccountBalanceRounded />}
					/>
				</GridItem>
				<GridItem xs={12} sm={6} md={6}>
					<CardStat
						title="股票總價值(每日更新)"
						updateTime={account ? `${account.last_value_update} 更新` : "更新中..."}
						value={account ? account.stock_value : 0}
						color="warning"
						icon={<LocalAtmRounded />}
					/>
				</GridItem>
			</GridContainer>
			<GridContainer>
				<GridItem xs={12} sm={12} md={12}>
					<p className="ch_font text-danger text-center">{tips[random_n]}</p>
					<Paper component="form" elevation={5} className={`${classes.searchBox} mb-3`}>
						<div className="p-3">
							<AccountBoxRoundedIcon color="primary" fontSize="large" />
						</div>
						<InputBase
							ref={searchRef}
							className={classes.searchInput}
							placeholder="搜尋股票代號"
							onChange={onChange}
							onKeyDown={handle_keyDown}
							value={searchText}
						/>
						<IconButton
							type="button"
							color="primary"
							className="p-3"
							onClick={handle_search_stock}
							onKeyDown={handle_keyDown}
						>
							<Search fontSize="large" />
						</IconButton>
					</Paper>
					<Material_Table
						title="搜尋紀錄"
						columns={stock_columns}
						data={userHistory}
						isLoading={loading}
						showToolBar={true}
						useSearch={true}
						useExport={false}
						maxBodyHeight={700}
						noDataDisplay="沒有搜尋紀錄"
						actions={[
							{
								icon: () => <LaunchRoundedIcon />,
								tooltip: "複製並搜尋",
								onClick: copy_stock,
							},
						]}
						headerStyle={{ backgroundColor: "#fffde7" }}
						toolbarStyle={{ backgroundColor: "#fff59d" }}
					/>
				</GridItem>
			</GridContainer>
			{stockInfo ? (
				<BuyDialog
					open={showBuyDialog}
					handleClose={handleCloseStockBuy}
					account={account}
					stockInfo={stockInfo}
					userStock={userStock}
					userTrack={userTrack}
					onExited={() => set_stockInfo(null)}
				/>
			) : null}
			<Backdrop className={classes.backdrop} open={blocking}>
				<div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
					<div
						className={classes.text}
						style={{
							marginBottom: "30px",
							fontSize: "2rem",
							color: "#fff3a1",
							backgroundColor: "rgba(87, 87, 87, 0.5)",
							padding: "10px 20px",
						}}
					>
						{"搜尋需要一點時間，請耐心等候 😅 "}
					</div>
					<LinearProgress className={classes.linearProgress} />
				</div>
			</Backdrop>
		</Fragment>
	);
};
