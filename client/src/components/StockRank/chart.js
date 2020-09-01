import React, { useState, useEffect } from "react";
// @material-ui/core
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from "moment";
import { useHistory } from "react-router";
import { apiTxn_get_class_avg } from "../../api";
import { handle_error } from "../../tools";
import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles(() => ({}));

export default function Chart({ data }) {
	const [timePoints, setTimePoints] = useState([]);
	const [txnCount, set_txnCount] = useState([]);
	const history = useHistory();
	const options = {
		chart: {
			type: "area",
			backgroundColor: null,
			borderColor: "rgba(245, 245, 245, 0.7)",
			borderWidth: 2,
			scrollablePlotArea: {
				minWidth: 700,
				scrollPositionX: 0,
				opacity: 0,
			},
		},
		responsive: {
			rules: [
				{
					condition: {
						minWidth: 700,
					},
					chartOptions: {
						chart: {
							scrollablePlotArea: null,
						},
					},
				},
			],
		},
		title: {
			style: {
				color: "#4CAF50",
				fontSize: "25px",
			},
			text: "班級股票交易頻率統計",
		},
		subtitle: {
			style: {
				color: "#4CAF50",
			},
			text: "顯示近期每日的股票交易",
		},
		xAxis: {
			title: {
				style: {
					color: "#A0A0A3",
				},
			},
			allowDecimals: false,
			categories: timePoints,
			accessibility: {
				rangeDescription: "Range: 10 days",
			},
			gridLineColor: null,
			labels: {
				style: {
					color: "#4CAF50",
				},
			},
			lineColor: null,
			minorGridLineColor: null,
			tickColor: null,
			scrollbar: {
				enable: true,
			},
		},
		yAxis: {
			allowDecimals: false,
			title: {
				text: "交易次數",
				style: {
					color: "#4CAF50",
				},
			},
			labels: {
				formatter: function() {
					return this.value + "次";
				},
				style: {
					color: "#4CAF50",
				},
			},
			gridLineColor: "#e6e6e6",
			lineColor: null,
			minorGridLineColor: null,
			tickColor: null,
			scrollbar: {
				enable: true,
			},
		},
		tooltip: {
			pointFormat: "{series.name} <b>{point.y}</b><br/>",
		},
		plotOptions: {
			area: {
				pointStart: 0,
				marker: {
					enabled: false,
					symbol: "circle",
					radius: 2,
					states: {
						hover: {
							enabled: true,
						},
					},
				},
			},
		},
		series: [
			{
				color: "#f44336",
				name: "失敗交易",
				data: txnCount[1],
			},
			{
				color: "#4CAF50",
				name: "成功交易",
				data: txnCount[0],
			},
		],
		legend: {
			backgroundColor: "rgba(255, 255, 255, 0.5)",
			itemStyle: {
				color: "#4caf50",
			},
			itemHoverStyle: {
				color: "#ff9800",
			},
			itemHiddenStyle: {
				color: "#ff9800",
			},
			title: {
				style: {
					color: "#C0C0C0",
				},
			},
		},
	};

	React.useEffect(() => {
		const loadData = async () => {
			const days_ago = 10; //顯示天數
			const x = []; //x軸
			const y = [[], []]; //y軸(success,fail)

			try {
				for (let i = days_ago; i >= 0; i--) {
					let s = [],
						f = [];
					let dayString = moment()
						.subtract(i, "days")
						.format("YYYY-MM-DD"); //轉換為最小單位為天
					data.forEach((item) => {
						let d = moment(item.order_time).format("YYYY-MM-DD");
						if (moment(dayString).isSame(moment(d))) {
							if (item.status === "success") {
								s.push(item);
							} else if (item.status === "fail") {
								f.push(item);
							}
						}
					});
					x.push(dayString);
					y[0].push(s.length);
					y[1].push(f.length);
				}
				setTimePoints(x);
				set_txnCount(y);
			} catch (error) {
				handle_error(error, history);
			}
		};
		loadData();
	}, []);

	return (
		<HighchartsReact
			containerProps={{ style: { height: "100%", width: "100%", margin: "auto" } }}
			highcharts={Highcharts}
			options={options}
			allowChartUpdate={true}
			updateArgs={[true, true, true]}
		/>
	);
}
