import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { InputBase, IconButton, Divider, Paper } from '@material-ui/core';
import { Menu, Search, Directions, Store, DateRange } from '@material-ui/icons';
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Table from "components/Transaction/Table.js";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const styles = theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
})
const useStyles = makeStyles(styles);
const useDash = makeStyles(dashboardStyle);
const Transaction = () => {
  const classes = useStyles();
  const d_classes = useDash();
  return (
    <>
    <GridContainer>
      <GridItem xs={12} sm={6} md={6}>
        <Card>
          <CardHeader color="success" stats icon>
            <CardIcon color="success">
              <Store />
            </CardIcon>
            <p className={d_classes.cardCategory}>目前總資產</p>
            <h3 className={d_classes.cardTitle}>$34,245</h3>
          </CardHeader>
          <CardFooter stats>
            <div className={d_classes.stats}>
              <DateRange />
              Last 24 Hours
            </div>
          </CardFooter>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={6} md={6}>
        <Card>
          <CardHeader color="success" stats icon>
            <CardIcon color="success">
              <Store />
            </CardIcon>
            <p className={d_classes.cardCategory}>目前股票資產</p>
            <h3 className={d_classes.cardTitle}>$34,245</h3>
          </CardHeader>
          <CardFooter stats>
            <div className={d_classes.stats}>
              <DateRange />
              Last 24 Hours
            </div>
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Paper component="form" elevation={5} className={`${classes.root} mb-3`}>
          <IconButton className={classes.iconButton} aria-label="menu">
            <Menu />
          </IconButton>
          <InputBase
            className={classes.input}
            placeholder="Search Google Maps"
            inputProps={{ 'aria-label': 'search google maps' }}
          />
          <IconButton type="submit" className={classes.iconButton} aria-label="search">
            <Search />
          </IconButton>
          <Divider className={classes.divider} orientation="vertical" />
          <IconButton color="primary" className={classes.iconButton} aria-label="directions">
            <Directions />
          </IconButton>
        </Paper>
        <Table />
      </GridItem>
    </GridContainer>
    </>
  )
}
export default Transaction;