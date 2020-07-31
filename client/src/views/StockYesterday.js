import React, { useState, useEffect, useRef, Fragment, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import { InputBase, IconButton, Divider, Paper, Button } from "@material-ui/core";
import { Search, ShowChart } from "@material-ui/icons";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Material_Table from "components/Table/Material_Table";
import LaunchRoundedIcon from "@material-ui/icons/LaunchRounded";
import FavoriteBorderRoundedIcon from "@material-ui/icons/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import { apiStock_list_all, apiUserStock_track, apiUserStock_track_get, apiStock_get_updateTime } from "../api";
import { useSnackbar } from "notistack";
import moment from "moment";
import { handle_error } from "../tools";
import copy from "clipboard-copy";
import localforage from "localforage";

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
		field: "trading_volume",
		title: "成交股數",
		customSort: (a, b) => customSort(a, b, "trading_volume"),
	},
	{
		field: "txn_number",
		title: "成交筆數",
		customSort: (a, b) => customSort(a, b, "txn_number"),
	},
	{
		field: "turnover_value",
		title: "成交金額",
		customSort: (a, b) => customSort(a, b, "turnover_value"),
	},
	{
		field: "opening_price",
		title: "開盤價",
		customSort: (a, b) => customSort(a, b, "opening_price"),
	},
	{
		field: "highest_price",
		title: "最高價",
		customSort: (a, b) => customSort(a, b, "highest_price"),
	},
	{
		field: "lowest_price",
		title: "最低價",
		customSort: (a, b) => customSort(a, b, "lowest_price"),
	},
	{
		field: "closing_price",
		title: "收盤價",
		customSort: (a, b) => customSort(a, b, "closing_price"),
	},
	{
		field: "up_down",
		title: "漲跌(+/-)",
	},
	{
		field: "up_down_spread",
		title: "漲跌價差",
		customSort: (a, b) => customSort(a, b, "up_down_spread"),
	},
	{
		field: "last_buy_price",
		title: "最後揭示買價",
		customSort: (a, b) => customSort(a, b, "last_buy_price"),
	},
	{
		field: "last_buy_volume",
		title: "最後揭示買量",
		customSort: (a, b) => customSort(a, b, "last_buy_volume"),
	},
	{
		field: "last_sell_price",
		title: "最後揭示賣價",
		customSort: (a, b) => customSort(a, b, "last_sell_price"),
	},
	{
		field: "last_sell_volume",
		title: "最後揭示賣量",
		customSort: (a, b) => customSort(a, b, "last_sell_volume"),
	},
	{
		field: "PE_ratio",
		title: "本益比",
		customSort: (a, b) => customSort(a, b, "PE_ratio"),
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
});

const useStyles = makeStyles(styles);

export const StockYesterday = function(props) {
	const searchRef = useRef();
	const classes = useStyles();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const [searchText, setSearchText] = useState("");
	const [stock_data, setStock_data] = useState([]);
	const [track_data, setTrack_data] = useState([]);
	const [loading, setLoading] = useState(false);
	const [update_time, set_update_time] = useState("");
	const history = useHistory();

	const handleSearch = () => {
		setLoading(true);
		setSearchText(searchRef.current.childNodes[0].value); //拿InputBase裡面的Input
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	};

	const handleTrack = async (event, row) => {
		setLoading(true);
		try {
			const status = track_data.includes(row.stock_id); //追蹤狀態
			const res = await apiUserStock_track({
				stock_id: row.stock_id,
			});
			if (res.data) {
				const track_res = await apiUserStock_track_get();
				let onlyTrackId_data = track_res.data.map((item) => item.stock_id);
				setTrack_data(onlyTrackId_data);
			}
			setTimeout(() => {
				setLoading(false);
				if (status) {
					addTrackSnack(`已取消 ${row.stock_id}【${row.stock_name}】的追蹤`, "success");
				} else {
					addTrackSnack(`已將 ${row.stock_id}【${row.stock_name}】加入追蹤`, "success");
				}
			}, 1000);
		} catch (error) {
			handle_error(error, history);
		}
	};

	//複製股票動作
	const copy_stock = (e, row) => {
		copy(row.stock_id);
		addCopySnack();
		history.push("/admin/stockRealTime", { stock_id: row.stock_id });
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

	const getActions = useCallback(
		() => [
			{
				icon: () => <LaunchRoundedIcon />,
				tooltip: "複製並搜尋",
				onClick: copy_stock,
			},
			(rowData) => {
				let inCollect = track_data.includes(rowData.stock_id); //判斷此股票使用者有沒有收藏
				return {
					icon: () => (inCollect ? <FavoriteRoundedIcon style={{ color: "#e57373" }} /> : <FavoriteBorderRoundedIcon />),
					tooltip: inCollect ? "Remove from Collect" : "Add to Collect",
					onClick: handleTrack,
				};
			},
		],
		[track_data]
	);

	//發出追蹤交易通知
	const addTrackSnack = (msg, color) => {
		enqueueSnackbar(msg, {
			variant: color,
			anchorOrigin: { horizontal: "right", vertical: "top" },
			autoHideDuration: 3000,
			ContentProps: {
				style: {
					backgroundColor: "#9c27b0",
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

	//取得sever資料
	const load_stock_remote = async (date) => {
		let stock_res = await apiStock_list_all();
		let track_res = await apiUserStock_track_get();
		let onlyTrackId_data = track_res.data.map((item) => item.stock_id); //只要stock_id
		await localforage.setItem("stocks", stock_res.data); //儲存進indexDB
		await localforage.setItem("updateTime", date); //新的更新

		setTrack_data(onlyTrackId_data);
		setStock_data(stock_res.data);
	};

	//取得本地暫存
	const load_stock_local = async (stocks) => {
		let track_res = await apiUserStock_track_get();
		let onlyTrackId_data = track_res.data.map((item) => item.stock_id); //只要stock_id
		setTrack_data(onlyTrackId_data);
		setStock_data(stocks);
	};

	//取得股票相關資料
	React.useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			try {
				let _stocks = await localforage.getItem("stocks"); //股票暫存
				let res = await apiStock_get_updateTime();
				let remote_updateTime = res.data; //遠端更新日期
				let local_updateTime = await localforage.getItem("updateTime"); //本地更新日期
				let stocks = _stocks ? (_stocks.length > 0 ? _stocks : null) : _stocks;

				if (stocks) {
					//股票暫存是否存在
					if (local_updateTime !== remote_updateTime) {
						//有更新拿遠端
						await load_stock_remote(remote_updateTime);
					} else {
						//沒更新拿暫存
						await load_stock_local(stocks);
					}
				} else {
					//未有股票資料拿遠端
					await load_stock_remote(remote_updateTime);
				}
				set_update_time(remote_updateTime);
				addTimeSnack(`股票收盤資訊更新時間：${remote_updateTime} 進行更新`, "info");
			} catch (error) {
				handle_error(error, history);
			}
			setLoading(false);
		};
		loadData();
	}, []);

	return (
		<Fragment>
			<GridContainer>
				<GridItem xs={12} sm={12} md={12}>
					<Paper component="form" elevation={5} className={`${classes.searchBox} mb-3`}>
						<InputBase ref={searchRef} className={classes.searchInput} placeholder="搜尋任何股票關鍵字" />
						<IconButton type="button" color="primary" className="p-3" onClick={handleSearch}>
							<Search fontSize="large" />
						</IconButton>
					</Paper>
					<Material_Table
						title={`台股收盤資訊【${update_time || "---"}】`}
						columns={stock_columns}
						data={stock_data}
						searchText={searchText}
						isLoading={loading}
						showToolBar={true}
						useSearch={false}
						useExport={true}
						actions={getActions()}
						maxBodyHeight={700}
						noDataDisplay="沒有符合的股票"
						headerStyle={{ backgroundColor: "#fffde7" }}
						toolbarStyle={{ backgroundColor: "#fff59d" }}
					/>
				</GridItem>
			</GridContainer>
		</Fragment>
	);
};
