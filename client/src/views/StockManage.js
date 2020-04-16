import React, { useState, Fragment } from "react";
import clsx from 'clsx';
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { TextField, FormHelperText, InputAdornment, Input } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Material_Table from 'components/Table/Material_Table';

const table_state = {
  columns: [
    { title: 'Name', field: 'name' },
    { title: 'Surname', field: 'surname' },
    { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
    {
      title: 'Birth Place',
      field: 'birthCity',
      lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
    },
  ],
  data: [
    { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
    { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
    { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
    { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
    { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
    { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
    { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
    { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
  ],
}


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  column: {
    flexBasis: '33.33%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
}));

export default function StockManage() {
  const classes = useStyles();
  const [searchText, setSearchText] = useState("");

  return (
    <Fragment>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              擁有的股票
            </CardHeader>
            <CardBody>
              <TextField
                label="擁有股票搜尋"
                style={{ margin: 8, width: '40%' }}
                placeholder="輸入任何關鍵字"
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                onChange={e => setSearchText(e.target.value)}
              />
              <Material_Table
                searchText={searchText}
                showToolBar={false}
                columns={table_state.columns}
                data={table_state.data}
                noContainer
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              追蹤的股票
            </CardHeader>
            <CardBody>
              <TextField
                label="追蹤股票搜尋"
                style={{ margin: 8, width: '40%' }}
                placeholder="輸入任何關鍵字"
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                onChange={e => setSearchText(e.target.value)}
              />
              <Material_Table
                searchText={searchText}
                showToolBar={false}
                columns={table_state.columns}
                data={table_state.data}
                noContainer
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </Fragment>
  )
}