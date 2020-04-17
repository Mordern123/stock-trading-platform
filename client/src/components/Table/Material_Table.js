import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import MaterialTable, { MTableToolbar } from 'material-table';
import Card from '@material-ui/core/Card';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';


const styles = theme => ({
  emptyDataSourceMessage: {
    position: 'absolute',
    top: '300px',
    width: '100%',
  }
})

const useStyles = makeStyles(styles);
export default function Custom_MaterialTable(props) {
  const classes = useStyles();
  const [count, setCount] = useState(0)
  const {
    tableRef,
    title,
    columns,
    data,
    showToolBar,
    useExport,
    useFilter,
    useSearch,
    useColumns,
    searchText,
    isLoading,
    noContainer,
    pageSize,
    pageSizeOptions,
    maxBodyHeight,
    handleStockBuy,
  } = props
  
  const options = {
    toolbar: showToolBar && true,
    search: useSearch && true,
    exportButton: useExport && true,
    filtering: useFilter && true,
    columnsButton: useColumns && true,
    searchText: searchText || "",
    pageSize: pageSize || 50,
    pageSizeOptions: pageSizeOptions || [50, 100, 200],
    maxBodyHeight: maxBodyHeight || 600,
  }

  // 更改key變數才會吃到搜尋字串
  useEffect(() => {
    setCount(count+1)
  }, [searchText, pageSize])

  return (
    <MaterialTable
      tableRef={tableRef}
      key={count}
      isLoading={isLoading}
      title={(<div className="ch_font">{title}</div>)}
      columns={columns}
      data={data}
      // editable={}
      options={options}
      components={{
        Container: props => noContainer ? (
          <div {...props}></div>
        ) : <Card raised {...props}></Card>
      }}
      localization={{
        header: {
          actions: ''
        },
        body: {
          emptyDataSourceMessage: <div>沒有資料可以顯示</div>
        },
        pagination: {
          labelDisplayedRows: "第 {from}-{to} 共 {count} 筆",
          labelRowsSelect: "筆"
        }
      }}
      onRowClick={(event, rowData) => console.log(event, rowData)}
      actions={[
        {
          icon: 'refresh',
          tooltip: 'Refresh Data',
          isFreeAction: true,
          onClick: () => tableRef.current && tableRef.current.onQueryChange(),
        },
        {
          icon: () => <ShoppingCartOutlinedIcon />,
          tooltip: 'Save User',
          onClick: handleStockBuy
        }
      ]}
    />
  );
}

Custom_MaterialTable.propTypes = {
  tableRef: PropTypes.object,
  title: PropTypes.string,
  columns: PropTypes.array,
  data: PropTypes.array,
  showToolBar: PropTypes.bool,
  useExport: PropTypes.bool,
  useFilter: PropTypes.bool,
  useSearch: PropTypes.bool,
  useColumns: PropTypes.bool,
  searchText: PropTypes.string,
  isLoading: PropTypes.bool,
  noContainer: PropTypes.bool,
  pageSize: PropTypes.number,
  pageSizeOptions: PropTypes.array,
  maxBodyHeight: PropTypes.number
}

