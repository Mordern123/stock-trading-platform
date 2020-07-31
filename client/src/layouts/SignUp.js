import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { apiUser_new, apiUser_login, apiUser_login_key } from "../api";
import { handle_error } from "../tools";
import clsx from "clsx";
import crypto from "crypto";
import "../assets/css/global.css";

function Copyright() {
	return (
		<Typography className="ch_font" variant="body2" color="textSecondary" align="center">
			{"iamhongwei0417@gmail.com"}
			<br />
			<Link color="inherit" href="https://github.com/hongwei0417">
				&copy; Hongwei 製作
			</Link>
		</Typography>
	);
}

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function SignUp() {
	const history = useHistory();
	const classes = useStyles();
	const [user_name, set_name] = useState(null);
	const [email, set_email] = useState(null);
	const [student_id, set_stu_id] = useState(null);
	const [password, set_psd] = useState(null);
	const [blocking, set_blocking] = useState(false);

	const sha512 = (password, secret) => {
		const value = crypto
			.createHmac("sha512", secret)
			.update(password)
			.digest("hex");
		return value;
	};

	const submit = async (e) => {
		try {
			set_blocking(true);

			e.preventDefault();
			const required_check = user_name && email;
			const stu_id_check = !isNaN(student_id) && student_id.length == 10;
			const password_check = password.match(/^(?=.*\d)(?=.*[a-z]).{6,30}$/);
			if (!required_check) {
				alert("請勿空白");
				set_blocking(false);
				return;
			}
			if (user_name.length > 20) {
				alert("名稱不可超過20個字");
				set_blocking(false);
				return;
			}
			if (!stu_id_check) {
				alert("學號格式錯誤");
				set_blocking(false);
				return;
			}
			if (!password_check) {
				alert("密碼格式錯誤(英數混合6~30字元)");
				set_blocking(false);
				return;
			}
			//進行註冊
			const res = await apiUser_new({
				user_name,
				email,
				student_id,
				password,
			});

			console.log(res.data);

			if (res.data.status) {
				//註冊成功
				//進行登入工作
				const key_res = await apiUser_login_key({ student_id });
				if (key_res.data) {
					const hashValue = sha512(password, key_res.data);
					const user_res = await apiUser_login({ student_id, hashValue });
					const { status, payload } = user_res.data;
					console.log(user_res.data);
					if (status) {
						//本地儲存
						localStorage.clear();
						localStorage.setItem("comeBack", true);

						alert("登入成功! 自動導向主畫面...");
						history.replace("/admin");
					} else {
						alert(payload);
					}
				} else {
					alert("無此用戶!");
				}
			} else {
				alert(res.data.payload);
			}
			set_blocking(false);
		} catch (error) {
			handle_error(error);
			set_blocking(false);
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography className="ch_font" component="h1" variant="h5">
					註冊
				</Typography>
				<form className={classes.form} onSubmit={submit}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								label="學生姓名"
								autoComplete="name"
								onChange={(e) => set_name(e.target.value)}
								inputProps={{
									className: "ch_font",
								}}
								InputLabelProps={{
									className: "ch_font",
								}}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								autoComplete="fname"
								variant="outlined"
								required
								fullWidth
								label="學號"
								autoFocus
								onChange={(e) => set_stu_id(e.target.value)}
								inputProps={{
									className: "ch_font",
								}}
								InputLabelProps={{
									className: "ch_font",
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								label="電子信箱"
								autoComplete="email"
								onChange={(e) => set_email(e.target.value)}
								inputProps={{
									className: "ch_font",
								}}
								InputLabelProps={{
									className: "ch_font",
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								label="密碼"
								type="password"
								autoComplete="current-password"
								onChange={(e) => set_psd(e.target.value)}
								inputProps={{
									className: "ch_font",
								}}
								InputLabelProps={{
									className: "ch_font",
								}}
							/>
						</Grid>
						{/* <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label={<div className="ch_font">{"我同意使用這個網站規則"}</div>}
              />
            </Grid> */}
					</Grid>
					<Button type="submit" fullWidth variant="contained" color="primary" className={clsx(classes.submit, "ch_font")} disabled={blocking}>
						註冊
					</Button>
					<Grid container justify="flex-end">
						<Grid item>
							<Link className="ch_font" href="/login" variant="body2">
								已經有帳號了? 登入吧
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
			<Box mt={5}>
				<Copyright />
			</Box>
		</Container>
	);
}
