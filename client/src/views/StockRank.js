import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Chart from "../components/StockRank/chart";
import { apiRank_list_all, apiTxn_list_all, apiUser_get } from "../api";
import { handle_error } from "../tools";
import clsx from "clsx";

const tips = [
	"貼心提醒: 未進行任何交易是不會顯示在排名上的喔",
	"貼心提醒: 股票排名更新時間為開盤每日 8:30 和 15:10 喔",
];

const column = ["名次", "學號", "擁有股票種類", "總交易次數", "帳戶總價值","投資報酬率"];

const styles = {
	cardCategoryWhite: {
		fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
		"&,& a,& a:hover,& a:focus": {
			color: "rgba(255,255,255,.62)",
			margin: "0",
			fontSize: "14px",
			marginTop: "0",
			marginBottom: "0",
		},
		"& a,& a:hover,& a:focus": {
			color: "#FFFFFF",
		},
	},
	cardTitleWhite: {
		color: "#FFFFFF",
		marginTop: "0px",
		minHeight: "auto",
		fontWeight: "300",
		fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
		marginBottom: "3px",
		textDecoration: "none",
		"& small": {
			color: "#777",
			fontSize: "65%",
			fontWeight: "400",
			lineHeight: "1",
		},
	},
};

const useStyles = makeStyles(styles);

export const StockRank = function() {
	const classes = useStyles();
	const [rankData, set_rankData] = useState([]);
	const [txnData, set_txnData] = useState(null);
	const [updateTime, setUpdateTime] = useState(null);
	const [loading, setLoading] = useState(false);
	const [random_n, set_random_n] = useState(Math.floor(Math.random() * tips.length));
	const [userRowIndex, set_userRowIndex] = useState(null);
	const history = useHistory();

	//載入帳戶
	React.useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			try {
				const res = await apiRank_list_all();
				const res2 = await apiUser_get();
				console.log(res);

				//刪除交易數量為0和總資產為0的資料
				const noZeroTxn = res.data.rank_data.filter(
					(item) => item.txn_count !== 0 && item.total_amount !== 0
				);

				let rowIndex = null;

				//製作Table資料
				const rowData = noZeroTxn.map((item, index) => {
					//取得user row index
					if (res2.data.student_id === item.student_id) rowIndex = index;
					return [
						index + 1,
						item.student_id,
						item.stock_number,
						item.txn_count,
						item.total_amount,
						item.investment_rate+"%",
					];
				});

				set_userRowIndex(rowIndex);
				set_rankData(rowData);
				setUpdateTime(res.data.updateTime);

				setLoading(false);
			} catch (error) {
				handle_error(error, history);
			}
		};
		loadData();
	}, []);

	//載入交易資料
	React.useEffect(() => {
		const loadData = async () => {
			try {
				let res = await apiTxn_list_all({ day: 10 });
				set_txnData(res.data);
			} catch (error) {
				handle_error(error, history);
			}
		};
		loadData();
	}, []);

	return (
		<GridContainer>
			<GridItem xs={12} sm={12} md={12}>
				<Card>
					<CardHeader plain color="warning">
						<h4 className={clsx(classes.cardTitleWhite)}>{"股票排名(每日更新)"}</h4>
						<p className={clsx(classes.cardCategoryWhite)}>刷新時間：{updateTime}</p>
					</CardHeader>
					<CardBody>
						{txnData ? <Chart data={txnData} /> : null}
						<p className="ch_font text-danger text-center mt-3">{tips[random_n]}</p>
						<Table
							tableHeaderColor="warning"
							tableHead={column}
							tableData={rankData}
							highlightRowIndex={userRowIndex}
						/>
					</CardBody>
				</Card>
			</GridItem>
		</GridContainer>
	);
};
