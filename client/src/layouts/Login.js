import React, { useState } from "react";
import { useHistory } from "react-router";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { apiUser_login, apiUser_login_key } from "../api";
import FaceRoundedIcon from "@material-ui/icons/FaceRounded";
import crypto from "crypto";
import clsx from "clsx";
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
	root: {
		height: "100vh",
	},
	image: {
		backgroundImage: "url(https://source.unsplash.com/random)",
		backgroundRepeat: "no-repeat",
		backgroundColor:
			theme.palette.type === "light" ? theme.palette.grey[50] : theme.palette.grey[900],
		backgroundSize: "cover",
		backgroundPosition: "center",
	},
	paper: {
		margin: theme.spacing(8, 4),
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
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function SignInSide() {
	const classes = useStyles();
	const history = useHistory();
	const [id, set_id] = useState(null);
	const [password, set_psd] = useState(null);
	const [remember, setRemember] = useState(false);
	const [count, setCount] = useState(0);

	const sha512 = (password, secret) => {
		const value = crypto
			.createHmac("sha512", secret)
			.update(password)
			.digest("hex");
		return value;
	};

	const handleRemember = (e) => {
		setRemember(!remember);
	};

	const submit = async (e) => {
		e.preventDefault();
		if (id && password) {
			const key_res = await apiUser_login_key({ id });
			if (key_res.data) {
				const hashValue = sha512(password, key_res.data);
				const user_res = await apiUser_login({ id, hashValue });
				const { status, payload } = user_res.data;

				if (status) {
					//本地儲存
					localStorage.clear();
					localStorage.setItem("comeBack", true);
					if (remember) {
						let userData = { id, password };
						localStorage.setItem("remember", JSON.stringify(userData));
					}
					history.replace("/admin");
				} else {
					alert(payload);
				}
			} else {
				alert("學號或信箱輸入有誤!");
			}
		} else {
			alert("輸入不能為空!");
		}
	};

	React.useEffect(() => {
		const user_json = localStorage.getItem("remember");
		if (user_json) {
			const userData = JSON.parse(user_json);
			set_id(userData.id);
			set_psd(userData.password);
			setRemember(true);
			setCount(count + 1);
		}
	}, []);

	return (
		<Grid container component="main" className={classes.root}>
			<CssBaseline />
			<Grid item xs={false} sm={4} md={7} className={classes.image} />
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<div className={classes.paper}>
					<img src={logo} width="50px" />
					<Typography className="ch_font" component="h1" variant="h5">
						登入
					</Typography>
					<Typography className="ch_font text-secondary" component="h1" variant="h6">
						股票模擬交易平台
					</Typography>
					<form key={count} className={classes.form} onSubmit={submit}>
						<TextField
							className="ch_font"
							variant="outlined"
							margin="normal"
							required
							fullWidth
							label="學號 or 信箱"
							autoFocus
							onChange={(e) => set_id(e.target.value)}
							defaultValue={id}
							inputProps={{
								className: "ch_font",
							}}
							InputLabelProps={{
								className: "ch_font",
							}}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							label="密碼"
							type="password"
							autoComplete="current-password"
							onChange={(e) => set_psd(e.target.value)}
							defaultValue={password}
							inputProps={{
								className: "ch_font",
							}}
							InputLabelProps={{
								className: "ch_font",
							}}
						/>
						<FormControlLabel
							control={
								<Checkbox
									key={remember}
									checked={remember}
									onClick={handleRemember}
									value="remember"
									color="primary"
								/>
							}
							label={<div className="ch_font">記住我</div>}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={clsx(classes.submit, "ch_font")}
						>
							登入
						</Button>
						<Grid container>
							{/* <Grid item xs>
                <Link href="#" variant="body2">
                  忘記密碼?
                </Link>
              </Grid> */}
							<Grid item>
								<Link className="ch_font" href="/signup" variant="body2">
									{"註冊一個新帳號"}
								</Link>
							</Grid>
						</Grid>
						<Box mt={5}>
							<Copyright />
						</Box>
					</form>
				</div>
			</Grid>
		</Grid>
	);
}
