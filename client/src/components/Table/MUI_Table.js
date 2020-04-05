import React, { useState } from "react";
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
const MUI_Table = (props) => {
  const [searchText, setSearchText] = useState("")
  const [count, setCount] = useState(0)
  const options = {
    filterType: "checkbox",
    responsive: "scroll",
    searchOpen: true,
    print: false,
    searchPlaceholder: '請輸入查詢關鍵字',
    searchText: searchText,
  };
  const test = () => {
    setSearchText("Joe")
    setCount(count+1)
  }

  console.log(options)

  return (
    <>
    <button onClick={test}>123</button>
    <MUIDataTable
      key={count}
      title={"Employee List"}
      data={data}
      columns={columns}
      options={options}
    />
    </>
  )
}

export default MUI_Table;