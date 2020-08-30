import React, { useState, useEffect, useRef, Fragment, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import LocalAtmRounded from "@material-ui/icons/LocalAtmRounded";
import AccountBalanceRounded from "@material-ui/icons/AccountBalanceRounded";
import Search from "@material-ui/icons/Search";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Material_Table from "components/Table/Material_Table";
import CardStat from "components/Transaction/Card_Stat";
import MonetizationOnRoundedIcon from "@material-ui/icons/MonetizationOnRounded";
import Backdrop from "@material-ui/core/Backdrop";
import { apiUserStock_get, apiUser_account, apiStock_realTime, apiTxn_get_success } from "../api";
import { useSnackbar } from "notistack";
import moment from "moment";
import { handle_error } from "../tools";
import SellDialog from "components/StockManage/Dialog_Sell";
import StockDetail from "components/StockManage/Detail_Stock";
import LinearProgress from "@material-ui/core/LinearProgress";
import delay from "delay";
import clsx from "clsx";

const userStock_columns = [
	{
		field: "stock_id",
		title: "證券代號",
	},
	{
		field: "stockInfo.stock_name",
		title: "證券名稱",
	},
	{
		field: "shares_number",
		title: "擁有股數",
	},
	{
		field: "last_update",
		title: "交易更新時間",
	},
	{
		field: "stockInfo.z",
		title: "近期買入價",
	},
	{
		field: "createdAt",
		title: "擁有時間",
	},
];

const styles = (theme) => ({
	"@global": {
		".ch_font": {
			fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
		},
	},
	searchInput1: {
		[theme.breakpoints.down("md")]: {
			width: "100%",
		},
		width: "50%",
		"& input, label": {
			fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
		},
		"& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
			borderColor: theme.palette.warning.main,
		},
		"& label.MuiInputLabel-animated.Mui-focused ": {
			color: theme.palette.warning.main,
		},
		"& .MuiOutlinedInput-root.Mui-focused svg": {
			color: theme.palette.warning.main,
		},
	},
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

export const StockSell = function() {
	const searchRef = useRef();
	const classes = useStyles();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const [searchText, set_searchText] = useState("");
	const [userStock, set_userStock] = useState([]);
	const [userTxn, set_userTxn] = useState([]);
	const [account_loading, set_account_loading] = useState(false);
	const [stock_loading, set_stock_loading] = useState(false);
	const [txn_loading, set_txn_loading] = useState(false);
	const [showSellDialog, set_showSellDialog] = useState(false);
	const [blocking, set_blocking] = useState(false);
	const [stockData, set_stockData] = useState(null);
	const [account, setAccount] = useState(null);
	const history = useHistory();

	const handleCloseStockSell = () => {
		set_showSellDialog(false);
	};

	//進入賣出股票畫面
	const handleOpenStockSell = async (event, row) => {
		try {
			//防呆
			if (blocking) {
				return;
			} else {
				set_blocking(true);
			}

			let res = await apiStock_realTime(row.stock_id);
			await delay(2000);

			if (res.status === 200) {
				set_stockData({
					stockInfo: res.data,
					userStock: row,
				});
				set_showSellDialog(true);
			} else if (res.status === 204) {
				alert("查無此股票");
			} else if (res.status === 205) {
				alert("收盤中不可交易");
			}
		} catch (error) {
			handle_error(error, history);
		}
		set_blocking(false);
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

	const get_stock_txn = (row) => {
		let data = userTxn.filter((item) => {
			return item.stock_id === row.stock_id;
		});
		return data;
	};

	//股票詳細資訊
	const getPanel = useCallback(() => [
		{
			tooltip: "顯示詳細資訊",
			render: (row) => {
				let data = get_stock_txn(row);
				return <StockDetail stock={row.stockInfo} data={data} />;
			},
		},
	]);

	//載入用戶帳號資訊
	React.useEffect(() => {
		const loadData = async () => {
			set_account_loading(true);
			try {
				const res = await apiUser_account();
				setAccount(res.data);
			} catch (error) {
				handle_error(error, history);
			}
			set_account_loading(false);
		};
		loadData();
		// addTimeSnack(`股票更新時間：${moment().calendar(null, { lastWeek: 'dddd HH:mm' })}`, 'info')
	}, []);

	//載入用戶擁有股票
	React.useEffect(() => {
		const loadData = async () => {
			set_stock_loading(true);
			try {
				const res = await apiUserStock_get();
				set_userStock(res.data);
			} catch (error) {
				handle_error(error, history);
			}
			set_stock_loading(false);
		};
		loadData();
	}, []);

	//載入用戶交易資訊
	React.useEffect(() => {
		const loadData = async () => {
			set_txn_loading(true);
			try {
				const res = await apiTxn_get_success({ pure: true });
				set_userTxn(res.data);
			} catch (error) {
				handle_error(error, history);
			}
			set_txn_loading(false);
		};
		loadData();
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
					<Card>
						<CardHeader color="warning">
							<Typography variant="subtitle1" className="ch_font">
								擁有的股票
							</Typography>
						</CardHeader>
						<CardBody>
							<TextField
								label="搜尋擁有股票"
								placeholder="輸入任何關鍵字"
								className={clsx(classes.searchInput1, "mb-3")}
								margin="dense"
								variant="outlined"
								onChange={(e) => set_searchText(e.target.value)}
								InputProps={{
									endAdornment: (
										<InputAdornment position="start">
											<Search />
										</InputAdornment>
									),
								}}
							/>
							<Material_Table
								searchText={searchText}
								showToolBar={false}
								isLoading={stock_loading && txn_loading}
								columns={userStock_columns}
								data={userStock}
								noContainer={true}
								noDataDisplay="沒有擁有的股票"
								detailPanel={getPanel()}
								actions={[
									{
										icon: () => <MonetizationOnRoundedIcon />,
										tooltip: "售出股票",
										onClick: handleOpenStockSell,
									},
								]}
								headerStyle={{ backgroundColor: "#fff3e0" }}
							/>
						</CardBody>
					</Card>
				</GridItem>
			</GridContainer>
			{stockData ? (
				<SellDialog
					open={showSellDialog}
					handleClose={handleCloseStockSell}
					stockData={stockData}
					onExited={() => set_stockData(null)}
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
