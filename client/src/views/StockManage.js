import React, { useState, Fragment } from "react";
import clsx from 'clsx';
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Typography from '@material-ui/core/Typography';
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
  '@global': {
    '.ch_font': {
      fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
    },
  },
  searchInput1: {
    margin: 8,
    width: '50%',
    "& input, label": {
      fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.warning.main,
    },
    "& label.MuiInputLabel-animated.Mui-focused ": {
      color: theme.palette.warning.main
    },
    "& .MuiOutlinedInput-root.Mui-focused svg": {
      color: theme.palette.warning.main,
    },
  },
  searchInput2: {
    margin: 8,
    width: '50%',
    "& input, label": {
      fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#9830B0",
    },
    "& label.MuiInputLabel-animated.Mui-focused ": {
      color: "#9830B0"
    },
    "& .MuiOutlinedInput-root.Mui-focused svg": {
      color: "#9830B0"
    },
  },
}));

export default function StockManage() {
  const classes = useStyles();
  const [searchText, setSearchText] = useState("");

  return (
    <Fragment>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">
              <Typography variant="subtitle1" className="ch_font">擁有的股票</Typography>
            </CardHeader>
            <CardBody>
              <TextField
                label="搜尋擁有股票"
                placeholder="輸入任何關鍵字"
                className={classes.searchInput1}
                margin="dense"
                variant="outlined"
                onChange={e => setSearchText(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <Material_Table
                searchText={searchText}
                showToolBar={false}
                columns={table_state.columns}
                data={table_state.data}
                noContainer={true}
                maxBodyHeight={'100%'}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="primary">
              <Typography variant="subtitle1" className="ch_font">追蹤的股票</Typography>
            </CardHeader>
            <CardBody>
              <TextField
                label="搜尋追蹤股票"
                placeholder="輸入任何關鍵字"
                margin="dense"
                className={classes.searchInput2}
                variant="outlined"
                onChange={e => setSearchText(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <Material_Table
                searchText={searchText}
                showToolBar={false}
                columns={table_state.columns}
                data={table_state.data}
                noContainer={true}
                maxBodyHeight={'100%'}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </Fragment>
  )
}