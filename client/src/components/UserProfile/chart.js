import React, { useState, useEffect } from "react";
// @material-ui/core
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { apiTxn_get_class_avg } from '../../api'

Highcharts.createElement('link', {
    href: 'https://fonts.googleapis.com/css?family=Unica+One',
    rel: 'stylesheet',
    type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

Highcharts.theme = {
  colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
      '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
  chart: {
      backgroundColor: {
          linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
          stops: [
              [0, '#2a2a2b'],
              [1, '#3e3e40']
          ]
      },
      style: {
          fontFamily: '\'Unica One\', sans-serif'
      },
      plotBorderColor: '#606063'
  },
  title: {
      style: {
          color: '#E0E0E3',
          textTransform: 'uppercase',
          fontSize: '20px'
      }
  },
  subtitle: {
      style: {
          color: '#E0E0E3',
          textTransform: 'uppercase'
      }
  },
  xAxis: {
      gridLineColor: '#707073',
      labels: {
          style: {
              color: '#E0E0E3'
          }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: {
          style: {
              color: '#A0A0A3'
          }
      }
  },
  yAxis: {
      gridLineColor: '#707073',
      labels: {
          style: {
              color: '#E0E0E3'
          }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      tickWidth: 1,
      title: {
          style: {
              color: '#A0A0A3'
          }
      }
  },
  tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      style: {
          color: '#F0F0F0'
      }
  },
  plotOptions: {
      series: {
          dataLabels: {
              color: '#F0F0F3',
              style: {
                  fontSize: '13px'
              }
          },
          marker: {
              lineColor: '#333'
          }
      },
      boxplot: {
          fillColor: '#505053'
      },
      candlestick: {
          lineColor: 'white'
      },
      errorbar: {
          color: 'white'
      }
  },
  legend: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      itemStyle: {
          color: '#E0E0E3'
      },
      itemHoverStyle: {
          color: '#FFF'
      },
      itemHiddenStyle: {
          color: '#606063'
      },
      title: {
          style: {
              color: '#C0C0C0'
          }
      }
  },
  credits: {
      style: {
          color: '#666'
      }
  },
  labels: {
      style: {
          color: '#707073'
      }
  },
  drilldown: {
      activeAxisLabelStyle: {
          color: '#F0F0F3'
      },
      activeDataLabelStyle: {
          color: '#F0F0F3'
      }
  },
  navigation: {
      buttonOptions: {
          symbolStroke: '#DDDDDD',
          theme: {
              fill: '#505053'
          }
      }
  },
  // scroll charts
  rangeSelector: {
      buttonTheme: {
          fill: '#505053',
          stroke: '#000000',
          style: {
              color: '#CCC'
          },
          states: {
              hover: {
                  fill: '#707073',
                  stroke: '#000000',
                  style: {
                      color: 'white'
                  }
              },
              select: {
                  fill: '#000003',
                  stroke: '#000000',
                  style: {
                      color: 'white'
                  }
              }
          }
      },
      inputBoxBorderColor: '#505053',
      inputStyle: {
          backgroundColor: '#333',
          color: 'silver'
      },
      labelStyle: {
          color: 'silver'
      }
  },
  navigator: {
      handles: {
          backgroundColor: '#666',
          borderColor: '#AAA'
      },
      outlineColor: '#CCC',
      maskFill: 'rgba(255,255,255,0.1)',
      series: {
          color: '#7798BF',
          lineColor: '#A6C7ED'
      },
      xAxis: {
          gridLineColor: '#505053'
      }
  },
  scrollbar: {
      barBackgroundColor: '#808083',
      barBorderColor: '#808083',
      buttonArrowColor: '#CCC',
      buttonBackgroundColor: '#606063',
      buttonBorderColor: '#606063',
      rifleColor: '#FFF',
      trackBackgroundColor: '#404043',
      trackBorderColor: '#404043'
  }
};
// Apply the theme
Highcharts.setOptions(Highcharts.theme);


export default function Chart() {
    const [individual_data, setIndividual_data] = useState([])
    const [class_data, setClass_data] = useState([])
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
            labels: {
                formatter: function () {
                    return this.value; // clean, unformatted number for year
                }
            },
            accessibility: {
                rangeDescription: 'Range: 1940 to 2017.'
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
            pointFormat: '{series.name} <b>{point.y}</b><br/> {point.x}'
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
        const res = await apiTxn_get_class_avg({
            day: 10
        })

        setClass_data(Object.values(res.data))
    }

    useEffect(() => {
        loadData()
    }, [])

    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
            containerProps={{ style: { height: "100%", width: "100%" } }}
        />
    )
}
