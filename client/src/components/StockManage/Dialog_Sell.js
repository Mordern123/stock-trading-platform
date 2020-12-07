import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import Backdrop from "@material-ui/core/Backdrop";
import Hidden from "@material-ui/core/Hidden";
import CircularProgress from "@material-ui/core/CircularProgress";
import { apiUserStock_sell, apiGlobal } from "../../api";
import { green, red } from "@material-ui/core/colors";
import Snack_Detail from "./Snack_Detail";
import { useSnackbar } from "notistack";
import { handle_error } from "../../tools";
import delay from "delay";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="left" ref={ref} {...props} />;
});

const styles = (theme) => ({
	text: {
		fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
	},
	dialogContent: {
		overflow: "auto",
	},
	stockInput: {
		"& label": {
			fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
		},
	},
	dialogTitle: {
		"& h2": {
			fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
		},
	},
	backdrop: {
		position: "absolute",
		zIndex: theme.zIndex.drawer + 1,
		color: theme.palette.info.dark,
		backgroundColor: "rgba(66, 66, 66, 0.2)",
	},
	cancelButton: {
		color: theme.palette.getContrastText(red[700]),
		backgroundColor: red[700],
		"&:hover": {
			backgroundColor: red[900],
		},
	},
	submitButton: {
		color: theme.palette.getContrastText(green[700]),
		backgroundColor: green[700],
		"&:hover": {
			backgroundColor: green[900],
		},
	},
	button: {
		"&:focus": {
			outline: "none",
		},
	},
});

const useStyles = makeStyles(styles);

export default function SellDialog(props) {
	const classes = useStyles();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const { open, handleClose, stockData, onExited } = props;
	const { stockInfo, userStock } = stockData;
	const { stock_id, stock_name } = stockInfo; //即時股票資訊
	const [stock_num, set_stock_num] = useState(null);
	const [loading, setLoading] = useState(false);
	const [reserve_time, set_reserve_time] = useState(180); //價格保留時間
	const [order_type, set_order_type] = useState("");
	const [bid_price, set_bid_price] = useState("");
	const [global, set_global] = useState({});
	const history = useHistory();

	const handleNumberChange = (e) => {
		let n = parseInt(e.target.value);
		set_stock_num(n);
	};

	const handlePriceChange = (e) => {
		let n = parseFloat(e.target.value);
		set_bid_price(n);
	};

	//更改訂單類型
	const change_orderType = (e) => {
		set_order_type(e.target.value);
	};

	const handleSellStock = async () => {
		//防呆
		setLoading(true);

		//0元不能交易
		if (!(parseFloat(stockInfo.z) > 0)) {
			alert("交易金額不能為0元");
			handleClose();
			setLoading(false);
			return;
		}

		//未選擇交易類型
		if (!order_type) {
			alert("請選擇交易類型");
			setLoading(false);
			return;
		}

		//限價未輸入價格
		if (order_type === "limit" && !bid_price && bid_price <= 0) {
			alert("輸入價格必須大於0");
			setLoading(false);
			return;
		}

		//限價輸入價格過高
		if (order_type === "limit" && bid_price >= 10000000) {
			alert("輸入價格過高");
			setLoading(false);
			return;
		}

		if (stock_num) {
			if (stock_num > 0) {
				if (stock_num <= 1000) {
					try {
						const res = await apiUserStock_sell(
							{
								stock_id: stockInfo.stock_id,
								shares_number: stock_num * 1000, //一張1000股
								stockInfo: stockInfo,
								bid_price: bid_price,
							},
							{ order_type }
						);
						await delay(2000);

						if (res.status === 200) {
							addSnack(); //發出通知
						} else {
							alert("交易失敗，請稍後嘗試");
						}
						handleClose();
					} catch (error) {
						handle_error(error, history);
						handleClose();
					}
				} else {
					alert("每筆訂單交易上限1000張");
				}
			} else {
				alert("輸入值要大於0");
			}
		} else {
			alert("必須輸入購買張數");
		}
		setLoading(false);
	};

	const addSnack = () => {
		enqueueSnackbar(`下單成功【${stock_id} ${stock_name}】`, {
			anchorOrigin: { horizontal: "right", vertical: "top" },
			content: (key, message) => (
				<Snack_Detail
					id={key}
					message={message}
					data={{
						stock_id,
						stock_name,
						stock_num,
						stock_price: bid_price,
						order_type: order_type,
					}}
				/>
			),
			persist: true,
		});
	};

	//設定關閉機制
	React.useEffect(() => {
		let interval = setInterval(() => {
			if (reserve_time > 0) {
				set_reserve_time(reserve_time - 1);
			} else {
				handleClose();
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [reserve_time]);

	//取得global
	React.useEffect(() => {
		const load = async () => {
			let res = await apiGlobal();
			set_global(res.data);
		};
		load();
	}, []);

	const get_input_class = () => {
		if (order_type === "market") {
			return "col-12 col-md-6 overflow-hidden pt-2 mt-3";
		} else if (order_type === "limit") {
			return "col-12 col-md-4 overflow-hidden pt-2 mt-3";
		} else {
			return "col-12 col-md-6 overflow-hidden pt-2 mt-3";
		}
	};

	const Tips = () => {
		if (order_type === "market" && global.stock_closing) {
			return (
				<p className="ch_font text-danger text-center">
					{"提醒: 現在為收盤期間，即時交易(盤中處理)，金額將以下次收盤價計算"}
				</p>
			);
		} else if (order_type === "limit" && global.stock_closing) {
			return (
				<p className="ch_font text-danger text-center">
					{"提醒: 現在為收盤期間，限價交易(盤後處理)，訂單將於下一個收盤日之後處理"}
				</p>
			);
		} else if (order_type === "market" && !global.stock_closing) {
			return (
				<p className="ch_font text-danger text-center">
					{"提醒: 現在為收盤期間，即時交易(盤中處理)，訂單於下單後40分鐘後抓取市價處理"}
				</p>
			);
		} else if (order_type === "limit" && !global.stock_closing) {
			return (
				<p className="ch_font text-danger text-center">
					{"提醒: 現在為開盤期間，限價交易(盤後處理)，訂單將於今日收盤後進行處理"}
				</p>
			);
		} else {
			return <div></div>;
		}
	};

	return (
		<Dialog
			open={open}
			TransitionComponent={Transition}
			fullWidth={true}
			maxWidth="sm"
			onExited={onExited}
		>
			<DialogTitle className={clsx("pb-0", classes.dialogTitle)}>
				<Hidden only={["xs", "sm"]} implementation="css">
					<div className="d-flex align-items-center justify-content-between">
						<span className="mr-1" style={{ fontSize: "30px", fontWeight: "bold" }}>
							{stockInfo.stock_name}
						</span>
						<div
							style={{ color: "#e57373", fontSize: "1rem" }}
						>{`頁面關閉時間: ${reserve_time} 秒`}</div>
					</div>
					<div className="d-flex align-items-end justify-content-between">
						<h3
							className="mb-0"
							style={{ fontSize: "3.5rem", color: "#1976d2", fontWeight: "bold" }}
						>
							{stockInfo.z}
						</h3>
						<DialogContentText className={clsx("mb-2 w-50 text-right", classes.text)}>
							此為模擬股市交易資料，為提供模擬交易使用，若有誤差值請見諒
						</DialogContentText>
					</div>
				</Hidden>
				<Hidden only={["md", "lg", "xl"]} implementation="css">
					<div className="row">
						<div className="col d-flex align-items-center">
							<span className="mr-1" style={{ fontSize: "30px", fontWeight: "bold" }}>
								{stockInfo.stock_name}
							</span>
						</div>
					</div>
					<div className="row">
						<h3
							className="col mb-0"
							style={{ fontSize: "3.5rem", color: "#1976d2", fontWeight: "bold" }}
						>
							{stockInfo.z}
						</h3>
					</div>
					<div className="row">
						<div className="col" style={{ color: "#e57373", fontSize: "1rem" }}>
							{`價格保留時間: ${reserve_time} 秒`}
						</div>
					</div>
					<div className="row">
						<DialogContentText className={clsx("col mb-2", classes.text)}>
							此為模擬股市交易資料，僅供模擬交易使用，有誤差值請見諒
						</DialogContentText>
					</div>
				</Hidden>
			</DialogTitle>
			<DialogContent className={clsx("pt-0", classes.dialogContent, classes.text)}>
				<List component="nav">
					<ListItem button>
						<ListItemText
							primary={
								<Typography
									variant="subtitle1"
									className={classes.text}
								>{`證券代號： ${stockInfo.stock_id}`}</Typography>
							}
						/>
					</ListItem>
					<Divider />
					<ListItem button className={classes.text}>
						<ListItemText
							primary={
								<Typography
									variant="subtitle1"
									className={classes.text}
								>{`即時成交價： ${stockInfo.z}`}</Typography>
							}
						/>
					</ListItem>
					<Divider />
					<ListItem button className={classes.text}>
						<ListItemText
							primary={
								<Typography
									variant="subtitle1"
									className={classes.text}
								>{`漲跌： ${stockInfo.ud}`}</Typography>
							}
						/>
					</ListItem>
					<Divider />
					<ListItem button className={classes.text}>
						<ListItemText
							primary={
								<Typography
									variant="subtitle1"
									className={classes.text}
								>{`累積成交量： ${stockInfo.v}`}</Typography>
							}
						/>
					</ListItem>
					<Divider />
					<ListItem button className={classes.text}>
						<ListItemText
							primary={
								<Typography
									variant="subtitle1"
									className={classes.text}
								>{`開盤： ${stockInfo.o}`}</Typography>
							}
						/>
					</ListItem>
					<Divider />
					<ListItem button className={classes.text}>
						<ListItemText
							primary={
								<Typography
									variant="subtitle1"
									className={classes.text}
								>{`每日最高： ${stockInfo.h}`}</Typography>
							}
						/>
					</ListItem>
					<Divider />
					<ListItem button className={classes.text}>
						<ListItemText
							primary={
								<Typography
									variant="subtitle1"
									className={classes.text}
								>{`每日最低： ${stockInfo.l}`}</Typography>
							}
						/>
					</ListItem>
					<Divider />
					<ListItem button className={classes.text}>
						<ListItemText
							primary={
								<Typography
									variant="subtitle1"
									className={classes.text}
								>{`昨收： ${stockInfo.y}`}</Typography>
							}
						/>
					</ListItem>
					<Divider />
					<ListItem button className={classes.text}>
						<ListItemText
							primary={
								<Typography
									variant="subtitle1"
									className={classes.text}
								>{`近期買入價： ${userStock.stockInfo.z}`}</Typography>
							}
						/>
					</ListItem>
					<Divider />
					<ListItem button className={classes.text}>
						<ListItemText
							primary={
								<Typography variant="subtitle1" className={classes.text}>
									{`目前擁有張數： ${
										userStock ? parseInt(userStock.shares_number / 1000) : 0
									}張 (${userStock ? userStock.shares_number : 0} 股)`}
								</Typography>
							}
						/>
					</ListItem>
					<Divider />
				</List>
				<div className="row d-flex justify-content-end align-items-center mt-3">
					<div className="col-12 justify-content-center align-center">
						<Tips />
					</div>
					<div className={get_input_class()}>
						<FormControl variant="outlined" fullWidth className={classes.selectBtn}>
							<InputLabel className="ch_font">{"選擇交易類型"}</InputLabel>
							<Select
								value={order_type}
								onChange={change_orderType}
								label={"選擇交易類型"}
							>
								<MenuItem className="ch_font" value="" disabled>
									<em>請選擇交易類型</em>
								</MenuItem>
								<MenuItem className="ch_font" value={"market"}>
									即時交易(盤中處理)
								</MenuItem>
								<MenuItem className="ch_font" value={"limit"}>
									限價交易(盤後處理)
								</MenuItem>
							</Select>
						</FormControl>
					</div>
					{order_type === "limit" ? (
						<div className={get_input_class()}>
							<TextField
								label="每股價格"
								type="number"
								variant="outlined"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">{"每股"}</InputAdornment>
									),
									endAdornment: (
										<InputAdornment
											position="end"
											children={
												<Typography className={classes.text}>元</Typography>
											}
										/>
									),
								}}
								inputProps={{
									min: 0,
								}}
								className={clsx("w-100", classes.stockInput)}
								onChange={handlePriceChange}
							/>
						</div>
					) : null}
					<div className={get_input_class()}>
						<TextField
							label="股票賣出數量"
							type="number"
							variant="outlined"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">{"下單"}</InputAdornment>
								),
								endAdornment: (
									<InputAdornment
										position="end"
										children={
											<Typography className={classes.text}>張</Typography>
										}
									/>
								),
							}}
							inputProps={{
								min: 0,
							}}
							className={clsx("w-100", classes.stockInput)}
							onChange={handleNumberChange}
						/>
					</div>
				</div>
				<Backdrop className={classes.backdrop} open={loading}>
					<CircularProgress color="primary" />
				</Backdrop>
			</DialogContent>
			<DialogActions className="p-3">
				<Button
					variant="contained"
					onClick={handleClose}
					classes={{ root: classes.cancelButton }}
					className={clsx(classes.text, classes.button)}
				>
					取消訂單
				</Button>
				<Button
					variant="contained"
					onClick={handleSellStock}
					classes={{ root: classes.submitButton }}
					className={clsx(classes.text, classes.button)}
				>
					確定下單
				</Button>
			</DialogActions>
		</Dialog>
	);
}

SellDialog.propTypes = {
	open: PropTypes.bool,
	handleClose: PropTypes.func,
	stockInfo: PropTypes.object,
};
