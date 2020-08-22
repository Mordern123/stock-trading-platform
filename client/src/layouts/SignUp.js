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
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { apiUser_new, apiUser_login, apiUser_login_key, apiGlobal } from "../api";
import { handle_error } from "../tools";
import clsx from "clsx";
import crypto from "crypto";
import logo from "assets/img/dock.gif";
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
	const [class_list, set_class_list] = useState([]);
	const [class_id, set_class_id] = useState("");

	//載入課程列表
	React.useEffect(() => {
		const load = async () => {
			let res = await apiGlobal();
			set_class_list(res.data.class);
		};
		load();
	}, []);

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
			// const password_check = password.match(/^(?=.*\d)(?=.*[a-z]).{6,30}$/);
			if (!required_check) {
				alert("請勿空白");
				set_blocking(false);
				return;
			}
			if (!class_id) {
				alert("請選擇你所修之課程名稱");
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
			// if (!password_check) {
			// 	alert("密碼格式錯誤(英數混合6~30字元)");
			// 	set_blocking(false);
			// 	return;
			// }
			//進行註冊
			const res = await apiUser_new({
				user_name,
				email,
				student_id,
				password,
				class_id,
			});

			if (res.data.status) {
				//註冊成功
				//進行登入工作
				const key_res = await apiUser_login_key({ id: email });
				if (key_res.data) {
					const hashValue = sha512(password, key_res.data);
					const user_res = await apiUser_login({ id: email, hashValue });
					const { status, payload } = user_res.data;

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
					alert("學號或信箱輸入有誤!");
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

	console.log(class_id);

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<img src={logo} width="50px" />
				<Typography className="ch_font" component="h1" variant="h5">
					註冊
				</Typography>
				<form className={classes.form} onSubmit={submit}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={12}>
							<Typography
								className="ch_font text-danger text-center"
								component="h1"
								variant="h6"
							>
								帳號創建時請務必注意!
							</Typography>
							<Typography
								className="ch_font text-danger text-center"
								component="h3"
								variant="h6"
							>
								成績會依據帳號所屬課程和學號去查詢
							</Typography>
						</Grid>
						<Grid item xs={12} sm={12}>
							<FormControl variant="outlined" className="w-100">
								<Select
									required
									className="ch_font"
									value={class_id || "null"}
									onChange={(e) => set_class_id(e.target.value)}
								>
									<MenuItem className="ch_font" value="null" disabled>
										{"請選擇修課名稱(重要)"}
									</MenuItem>
									{class_list.map((item, i) => (
										<MenuItem key={i} value={item.id} className="ch_font">
											{item.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								label="暱稱(之後可改)"
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
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={clsx(classes.submit, "ch_font")}
						disabled={blocking}
					>
						註冊並登入
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
