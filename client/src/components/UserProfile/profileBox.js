import React, { useState } from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	Slide,
	InputLabel,
	Typography,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CustomInput from "components/CustomInput/CustomInput.js";
import { apiUser_update } from "../../api";
import { useSnackbar } from "notistack";
import { handle_error } from "../../tools";
import moment from "moment";
import "../../assets/css/global.css";

const styles = (theme) => ({
	inputLabel: {
		display: "flex",
	},
	closeButton: {
		position: "absolute",
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
	customTypo: {
		fontFamily: "'Noto Sans TC', sans-serif",
		color: "rgba(68,68,68,0.9)",
		fontSize: "1.5rem",
	},
});

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
const useStyles = makeStyles(styles);

export default function ProfileBox({ open, handleClose, userData, loadData }) {
	const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();
	const { _id, student_id, sex, birthday, user_name, email } = userData;
	const [_user_name, setUserName] = useState("");
	const [_sex, setSex] = useState("");
	const [_birthday, setBirthday] = useState("");
	const history = useHistory();

	const onEnter = () => {
		setUserName(user_name);
		setSex(sex);
		setBirthday(birthday);
	};

	const handelSubmit = async () => {
		try {
			if (!_user_name) {
				alert("名稱不可為空白");
				return;
			}
			const res = await apiUser_update({
				uid: _id,
				user_name: _user_name,
				sex: _sex,
				birthday: _birthday,
			});
			const status = await loadData();
			if (status) {
				addSnack("已成功更新個人資料", "success", "#4caf50");
			} else {
				addSnack("個人資料更新失敗", "error", "#f44336");
			}
			handleClose();
		} catch (error) {
			handle_error(error, history);
		}
	};

	const addSnack = (msg, type, color) => {
		enqueueSnackbar(msg, {
			variant: type,
			ContentProps: {
				style: {
					backgroundColor: color,
					color: "white",
				},
				className: classes.text,
			},
			anchorOrigin: { horizontal: "right", vertical: "top" },
		});
	};

	return (
		<Dialog
			open={open}
			TransitionComponent={Transition}
			keepMounted
			onClose={handleClose}
			onEnter={onEnter}
		>
			<DialogTitle>
				<Typography className={classes.customTypo}>編輯個人資料</Typography>
				<IconButton
					aria-label="close"
					className={classes.closeButton}
					onClick={handleClose}
				>
					<Close />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<GridContainer>
					<GridItem xs={12} sm={12} md={12}>
						<CustomInput
							labelText="用戶ID"
							formControlProps={{
								fullWidth: true,
							}}
							inputProps={{
								disabled: true,
								defaultValue: _id,
							}}
						/>
					</GridItem>
				</GridContainer>
				<GridContainer>
					<GridItem xs={12} sm={12} md={6}>
						<CustomInput
							labelText="學號"
							formControlProps={{
								fullWidth: true,
							}}
							inputProps={{
								disabled: true,
								defaultValue: student_id,
							}}
						/>
					</GridItem>
					<GridItem xs={12} sm={12} md={6}>
						<CustomInput
							labelText="姓名"
							formControlProps={{
								fullWidth: true,
							}}
							inputProps={{
								className: "ch_font",
								value: _user_name,
								onChange: (e) => setUserName(e.target.value),
							}}
						/>
					</GridItem>
				</GridContainer>
				<GridContainer>
					<GridItem xs={12} sm={12} md={12}>
						<CustomInput
							labelText="Email"
							formControlProps={{
								fullWidth: true,
							}}
							inputProps={{
								disabled: true,
								value: email,
								autoComplete: "email",
							}}
						/>
					</GridItem>
				</GridContainer>
				<GridContainer>
					<GridItem xs={12} sm={12} md={6}>
						<CustomInput
							labelText="性別"
							formControlProps={{
								fullWidth: true,
							}}
							inputProps={{
								className: "ch_font",
								value: _sex || "",
								onChange: (e) => setSex(e.target.value),
							}}
						/>
					</GridItem>
					<GridItem xs={12} sm={12} md={6}>
						<div style={{ marginTop: "11px" }}>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<KeyboardDatePicker
									fullWidth
									disableToolbar
									// variant="inline"
									format="yyyy/MM/dd/"
									margin="normal"
									label="生日"
									value={_birthday || moment().toDate()}
									onChange={(e) => setBirthday(e)}
									KeyboardButtonProps={{
										"aria-label": "change date",
									}}
								/>
							</MuiPickersUtilsProvider>
						</div>
					</GridItem>
				</GridContainer>
			</DialogContent>
			<DialogActions>
				<Button onClick={handelSubmit} color="primary">
					更新
				</Button>
			</DialogActions>
		</Dialog>
	);
}
