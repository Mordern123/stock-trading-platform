import React, { useState, useEffect } from "react";
import MUIDataTable, { TableHead } from "mui-datatables";

const columns = ["Name", "Company", "City", "State"];
const data = [
  ["Joe James", "Test Corp", "Yonkers", "NY"],
  ["John Walsh", "Test Corp", "Hartford", "CT"],
  ["Bob Herm", "Test Corp", "Tampa", "FL"],
  ["James Houston", "Test Corp", "Dallas", "TX"],
  ["James Houston", "Test Corp", "Dallas", "TX"],
  ["James Houston", "Test Corp", "Dallas", "TX"],
  ["James Houston", "Test Corp", "Dallas", "TX"],
];

export default function MUI_Table(props) {
  const { searchText } = props
  const [count, setCount] = useState(0)
  const options = {
    filterType: "checkbox",
    responsive: "scroll",
    searchOpen: true,
    print: false,
    searchPlaceholder: '請輸入查詢關鍵字',
    search: false,
    searchText: searchText,
    customSearchRender: () => null
  };

  useEffect(() => {
    setCount(count+1)
  }, [searchText])

  return (
    <MUIDataTable
      key={count}
      title={"Employee List"}
      data={data}
      columns={columns}
      options={options}
    />
  )
}
