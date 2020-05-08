import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { apiTxn_get_all } from '../../api'

const testUser = "5ea7c55655050f2b883173ce"

const columns = [
  { field: 'stock_id', label: '證券代號' },
  { field: 'stock.stock_name', label: '證券名稱' },
  { field: 'type', label: '交易類型'},
  { field: 'shares_number', label: '交易股數' },
  { field: 'bid_price', label: '每股出價' },
  { field: 'stock.closing_price', label: '每股成交價格' },
  { field: 'order_time', label: '下單時間' },
  { field: 'txn_time', label: '交易處理時間' },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [txnData, setTxnData] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const loadData = async() => {
    const res = await apiTxn_get_all({
      uid: testUser
    })
    setTxnData(res.data) 
  }

  useEffect(() => {
    loadData()
  }, []) 

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column, i) => (
                <TableCell
                  key={i}
                  align='center'
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {txnData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                  {columns.map((column, j) => {
                    const f = column.field.split(".")
                    const value = f.length == 1 ? row[f[0]] : row[f[0]][f[1]];
                    return (
                      <TableCell key={j} align='center'>
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={txnData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}