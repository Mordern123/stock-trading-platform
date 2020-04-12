import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import MaterialTable, { MTableToolbar } from 'material-table';

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

const styles = ({

})

const useStyles = makeStyles(styles);
export default function Custom_MaterialTable(props) {
  const { title, useExport, filter, showToolBar, search, searchText } = props
  const classes = useStyles();
  const [count, setCount] = useState(0)
  const [state, setState] = useState(table_state);
  const options = {
    toolbar: showToolBar && true,
    search: search && true,
    exportButton: useExport && true,
    filtering: filter && true,
    searchText,
  }

  useEffect(() => {
    setCount(count+1)
  }, [searchText])

  return (
    <MaterialTable
      key={count}
      title={(
        <div className="ch_font">{title}</div>
      )}
      columns={state.columns}
      data={state.data}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.push(newData);
                return { ...prevState, data };
              });
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {  
              resolve();
              if (oldData) {
                setState((prevState) => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  return { ...prevState, data };
                });
              }
            }, 600);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.splice(data.indexOf(oldData), 1);
                return { ...prevState, data };
              });
            }, 600);
          }),
      }}
      options={options}
      components={{
        // Toolbar: props => (
        //     <div style={{ backgroundColor: '#e8eaf5' }}>
        //         <MTableToolbar {...props} />
        //     </div>
        // ),
        Container: props => (
          <div {...props}>
          </div>
        )
      }}
    />
  );
}

Custom_MaterialTable.propTypes = {
  title: PropTypes.string,
  showToolBar: PropTypes.bool,
  useExport: PropTypes.bool,
  filter: PropTypes.bool,
  search: PropTypes.bool,
  searchText: PropTypes.string
}

