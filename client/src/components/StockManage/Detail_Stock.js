import React, { useState, useEffect } from "react";
// @material-ui/core
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'
import { useHistory } from 'react-router'
import { handle_error } from "../../tools"

export default function StockDetail({ stock, data }) {
    const [timePoints, setTimePoints] = useState([])
    const [txnCount, set_txnCount] = useState([])
    const history = useHistory()
    const options = {
        chart: {
            type: 'column',
        },
        title: {
            text: `【${stock.stock_id} ${stock.stock_name}】 你的近期成交次數`
        },
        xAxis: {
            allowDecimals: false,
            // labels: {
            //     formatter: function () {
            //         return this.value; // clean, unformatted number for year
            //     }
            // },
            categories: timePoints,
            accessibility: {
                rangeDescription: 'Range: 15 days'
            }
        },
        yAxis: {
            tickInterval: 1,
            title: {
                text: '成功交易次數'
            },
            labels: {
                formatter: function () {
                    return this.value + '次';
                }
            }
        },
        tooltip: {
            pointFormat: '{series.name} <b>{point.y}</b><br/>'
        },
        plotOptions: {
            area: {
                pointStart: 0,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: '交易次數',
            data: txnCount,
            borderColor: null,
            color: '#ffb74d'
        }]
    }

    React.useEffect(() => {
        const loadData = async() => {
            const days_ago = 15 //顯示天數
            const x = [] //x軸
            const y = [] //y軸

            try {    
                for(let i = days_ago; i >= 0; i--) {
                let dayString = moment().subtract(i, 'days').format('YYYY-MM-DD'); //轉換為最小單位為天
                let txn = data.filter((item) => {
                    let d = moment(item.order_time).format('YYYY-MM-DD')
                    return moment(dayString).isSame(moment(d))
                })
                x.push(dayString)
                y.push(txn.length)
                }
                setTimePoints(x)
                set_txnCount(y)

            } catch (error) {
                handle_error(error, history)
            }
        }
        loadData()
    }, [])

    return (
      <HighchartsReact
        containerProps={{ style: { height: "100%", width: "100%", margin: 'auto', } }}
        highcharts={Highcharts}
        options={options}
        allowChartUpdate={true}
        updateArgs={[true, true, true]}
      />
    )
}
