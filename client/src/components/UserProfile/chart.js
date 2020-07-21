import React, { useState, useEffect } from "react";
// @material-ui/core
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'
import { useHistory } from 'react-router'
import { apiTxn_get_all } from '../../api'
import { handle_error } from "../../tools"

export default function Chart() {
    const [timePoints, set_timePoints] = useState([])
    const [txnCount, set_txnCount] = useState([])
    const history = useHistory()
    const options = {
        chart: {
            type: 'column',
            scrollablePlotArea: {
                minWidth: 700,
                scrollPositionX: 0,
                opacity: 0
            }
        },
        responsive: {
            rules: [{
                condition: {
                    minWidth: 700
                },
                chartOptions: {
                    chart: {
                        scrollablePlotArea: null
                    }
                }
            }]
        },
        title: {
            text: '個人股票交易統計'
        },
        subtitle: {
            text: '顯示每日的股票交易次數'
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
                rangeDescription: 'Range: 10 days'
            }
        },
        yAxis: {
            title: {
                text: '交易次數'
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
        series: [{
            name: '成功交易次數',
            data: txnCount[0],
            color: "#4caf50",
            borderColor: null,
        }, {
            name: '失敗交易次數',
            data: txnCount[1],
            color: "#f44336",
            borderColor: null,
        }]
    }

    React.useEffect(() => {
        const loadData = async() => {
            try {
                let days_ago = 10 //顯示天數
                let x = [] //x軸
                let y = [[],[]] //y軸(success,fail)
                let res = await apiTxn_get_all({day: days_ago, pure: true})

                for(let i = days_ago; i >= 0; i--) {
                    let s = [], f = []
                    let dayString = moment().subtract(i, 'days').format('YYYY-MM-DD'); //轉換為最小單位為天
                    res.data.forEach((item) => {
                        let d = moment(item.order_time).format('YYYY-MM-DD')
                        if(moment(dayString).isSame(moment(d))) {
                            if(item.status === 'success') {
                                s.push(item)
                            } else if(item.status === 'fail') {
                                f.push(item)
                            }
                        }
                    })
                    x.push(dayString)
                    y[0].push(s.length)
                    y[1].push(f.length)
                }
                set_timePoints(x)
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
