import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import { Paper, Tabs, Tab, Typography, Box } from "@material-ui/core";
import SwipeableViews from 'react-swipeable-views';
import MUI_Table from 'components/Table/MUI_Table';
import Material_Table from "components/Table/Material_Table";


const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <Typography
      component="div"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box p={0}>{children}</Box>}
    </Typography>
  );
}

const StockStatus = () => {
  // const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Paper elevation={5}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            // variant="fullWidth"
          >
            <Tab label="成功交易" />
            <Tab label="等待交易" />
            <Tab label="失敗交易" />
          </Tabs>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChange}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <Material_Table />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <Material_Table />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <Material_Table />
            </TabPanel>
          </SwipeableViews>
        </Paper>
      </GridItem>
    </GridContainer>
  )
}

export default StockStatus;