import React, { useState, useEffect, useRef } from "react";
import { makeStyles, createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import MaterialTable, { MTableToolbar } from "material-table";
import Card from "@material-ui/core/Card";

const tableTheme = createMuiTheme({
	typography: {
		fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif !important",
	},
	overrides: {
		MuiTableRow: {
			hover: {
				"&:hover": {
					cursor: "default !important",
				},
			},
		},
	},
});

const styles = (theme) => ({
	emptyDataSourceMessage: {
		position: "absolute",
		top: "300px",
		width: "100%",
	},
	text: {
		fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
	},
});

const useStyles = makeStyles(styles);
export default function Custom_MaterialTable({
		title,
		columns,
		data,
		showToolBar,
		useExport,
		useFilter,
		useSearch,
		useColumns,
		actions,
		searchText,
		isLoading,
		noContainer,
		pageSizeOptions,
		maxBodyHeight,
		detailPanel,
		actionsColumnIndex,
		noDataDisplay,
		toolbarStyle,
		headerStyle,
	} ) {
	const classes = useStyles();
	const tableRef = useRef();
	const [options, set_options] = React.useState({
		draggable: false,
		toolbar: showToolBar && true,
		search: useSearch && true,
		exportButton: useExport && true,
		filtering: useFilter && true,
		columnsButton: useColumns && true,
		searchText: searchText || "",
		pageSize: 10,
		pageSizeOptions: pageSizeOptions || [50, 100, 200],
		maxBodyHeight: maxBodyHeight || 600,
		actionsColumnIndex: actionsColumnIndex == null ? 0 : actionsColumnIndex,
		headerStyle: headerStyle,
	})

	// ! 可能會造成 memory leak
	// React.useEffect(() => {
	// 	let result_count = tableRef.current.state.data.length;
	// 	result_count = result_count < 10 ? 10 : result_count;
	// 	if (result_count < 50) {
	// 		setPageSize(result_count);
	// 	} else {
	// 		setPageSize(50);
	// 	}
	// }, [isLoading == false]);

	// React.useEffect(() => {
	// 	if(searchText) {
	// 		set_options({
	// 			...options,
	// 			searchText: searchText
	// 		})
	// 	}
	// }, [searchText])

	return (
		<ThemeProvider theme={tableTheme}>
			<MaterialTable
				className={classes.row}
				tableRef={tableRef}
				isLoading={isLoading}
				title={<div className="ch_font">{title}</div>}
				columns={columns}
				data={data}
				options={{
					...options,
					searchText
				}}
				components={{
					Container: (props) =>
						noContainer ? <div {...props}></div> : <Card raised {...props}></Card>,
					Toolbar: (props) => (
						<div style={toolbarStyle}>
							<MTableToolbar {...props} />
						</div>
					),
				}}
				localization={{
					header: {
						actions: "",
					},
					body: {
						emptyDataSourceMessage: <div className={classes.text}>{noDataDisplay}</div>,
					},
					pagination: {
						labelDisplayedRows: "第 {from}-{to} 共 {count} 筆",
						labelRowsSelect: "筆",
					},
				}}
				actions={actions}
				detailPanel={detailPanel}
			/>
		</ThemeProvider>
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
	pageSizeOptions: PropTypes.array,
	maxBodyHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	detailPanel: PropTypes.array,
	actionsColumnIndex: PropTypes.number,
	noDataDisplay: PropTypes.string,
};
