import React, { useState, useEffect } from "react";
// @material-ui/core
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'
import { useHistory } from 'react-router'
import { apiTxn_get_class_avg } from '../../api'
import { handle_error } from "../../tools"

export default function Chart() {
    const [timePoints, setTimePoints] = useState([])
    const [individual_data, setIndividual_data] = useState([])
    const [class_data, setClass_data] = useState([])
    const history = useHistory()
    const options = {
        chart: {
            type: 'area'
        },
        accessibility: {
            description: '顯示每日的股票交易次數'
        },
        title: {
            text: '股票交易活躍度'
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
            name: '個人活躍度',
            data: [0,0,3,5,1,1,0,3,0,0]
        }, {
            name: '班級活躍度',
            data: class_data
        }]
    }

    const loadData = async() => {
        const days_ago = 10
        const _timePoints = new Array(days_ago)
        const classData = new Array(days_ago)

        try {
            const res = await apiTxn_get_class_avg({ day: days_ago })
    
            for(let i = 0; i < days_ago; i++) {
                let dayString = moment().subtract(i+1, 'days').format('YYYY-MM-DD'); //轉換為最小單位為天
                _timePoints[i] = dayString
                classData[i] = res.data[dayString] || 0
            }
    
            setTimePoints(_timePoints)
            setClass_data(classData)
            
        } catch (error) {
            handle_error(error, history)
        }
    }

    useEffect(() => {
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
