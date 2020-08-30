import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { apiTxn_get_all } from "../../api";
import { handle_error } from "../../tools";
import "../../assets/css/global.css";

const columns = [
	{ field: "stock_id", label: "證券代號" },
	{ field: "stockInfo.stock_name", label: "證券名稱" },
	{ field: "order_type", label: "訂單類型" },
	{ field: "type", label: "交易類型" },
	{ field: "shares_number", label: "交易股數" },
	{ field: "bid_price", label: "每股出價" },
	{ field: "stockInfo.z", label: "每股價格" },
	{ field: "order_time", label: "下單時間" },
	{ field: "txn_time", label: "交易處理時間" },
];

const useStyles = makeStyles({
	root: {
		width: "100%",
	},
	container: {
		minHeight: 440,
		maxHeight: 440,
	},
});

export default function StickyHeadTable() {
	const classes = useStyles();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [txnData, setTxnData] = useState([]);
	const history = useHistory();

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const loadData = async () => {
		try {
			const res = await apiTxn_get_all();
			setTxnData(res.data);
		} catch (error) {
			handle_error(error, history);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	return (
		<Paper className={classes.root}>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							{columns.map((column, i) => (
								<TableCell key={i} align="center" className="ch_font">
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{txnData
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row, i) => {
								return (
									<TableRow hover role="checkbox" tabIndex={-1} key={i}>
										{columns.map((column, j) => {
											const f = column.field.split(".");
											const value =
												f.length == 1 ? row[f[0]] : row[f[0]][f[1]];
											if (column.field === "order_type") {
												let v =
													value === "market"
														? "市價"
														: value === "limit"
														? "限價"
														: "---";
												return (
													<TableCell
														key={j}
														align="center"
														className="ch_font"
													>
														{v}
													</TableCell>
												);
											} else if (column.field === "bid_price") {
												let v = value || "無";
												return (
													<TableCell
														key={j}
														align="center"
														className="ch_font"
													>
														{v}
													</TableCell>
												);
											} else {
												return (
													<TableCell
														key={j}
														align="center"
														className="ch_font"
													>
														{value}
													</TableCell>
												);
											}
										})}
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component="div"
				count={txnData.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}
