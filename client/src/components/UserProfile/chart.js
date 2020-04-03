import React from "react";
// @material-ui/core
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'


const chart = () => {
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        title: {
          text: 'My chart'
        },
        series: [{
          data: [1, 2, 3]
        }]
      }}
      containerProps={{ style: { height: "100%", width: "100%" } }}
    />
  )
}

export default chart;