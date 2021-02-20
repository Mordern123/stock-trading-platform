import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";
import IconButton from "@material-ui/core/IconButton";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import PersonRoundedIcon from "@material-ui/icons/PersonRounded";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import { useHistory } from "react-router";
import {
	apiClass_add_post,
	apiClass_get_post_all,
	apiClass_get_comment,
	apiClass_add_comment,
	apiClass_get_post,
} from "../api";
import { handle_error } from "../tools";
import "moment/locale/zh-tw";
import moment from "moment";
import delay from "delay";

moment.locale("zh-tw");

const colors = [
	"#a5d6a7", //綠
	"#90caf9", //藍
	"#f48fb1", //粉紅
	"#fff59d", //黃
	"#b39ddb", //紫
	"#ffab91", //橘
	"#bcaaa4", //咖啡
	"#80cbc4", //藍綠
];

const useStyles = makeStyles((theme) => ({
	"@global": {
		ch_font: {
			fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif !important",
		},
	},
	root: {
		height: "250px",
		maxHeight: "250px",
		opacity: 0.8,
		"&:hover": {
			cursor: "pointer",
			opacity: 1,
		},
	},
	title: {
		fontSize: 14,
	},
	closeButton: {
		position: "absolute",
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
	backdrop: {
		position: "absolute",
		zIndex: theme.zIndex.drawer + 1,
		color: theme.palette.warning.dark,
		backgroundColor: "rgba(0, 0, 0, 0.04)",
	},
	cardContainer: {
		position: "relative",
		minHeight: "60vh",
	},
	comment_input: {
		display: "flex",
		position: "absolute",
		height: "100%",
		width: "100%",
		backgroundColor: "black",
	},
}));

export const Discussion = function() {
	const classes = useStyles();
	const [open, set_open] = React.useState(false);
	const [checkShow, set_checkShow] = React.useState(false);
	const [data, set_data] = React.useState([]); //所有文章資料
	const [title, set_title] = React.useState("");
	const [content, set_content] = React.useState("");
	const [loading, set_loading] = React.useState(false);
	const [blocking, set_blocking] = React.useState(false);
	const [msg, set_msg] = React.useState(null);
	const [random_colors, set_random_colors] = React.useState([]);
	const history = useHistory();

	const close = () => {
		set_open(false);
		set_checkShow(false);
	};

	const onChange = (e) => {
		let type = e.currentTarget.getAttribute("id");
		if (type === "title") {
			set_title(e.target.value);
		} else if (type === "content") {
			set_content(e.target.value);
		}
	};

	const submit = async () => {
		//防呆
		if (blocking) {
			return;
		} else {
			set_blocking(true);
		}
		try {
			let result = await apiClass_add_post({ title, content });
			console.log(result);
			update();
			await delay(2000);
			set_title("");
			set_content("");
			set_checkShow(false);
		} catch (error) {
			handle_error(error, history);
			set_checkShow(false);
		}
		set_blocking(false);
	};

	const check = () => {
		if (title && content) {
			if (title.length > 50) {
				alert("標題字數需小於50個字");
				return;
			}
			if (content.length > 800) {
				alert("內容字數需小於800個字");
				return;
			}
			set_checkShow(true);
		} else {
			alert("需先輸入內容");
		}
	};

	const update = async () => {
		set_loading(true);

		try {
			let res = await apiClass_get_post_all();
			let c = res.data.map(() => {
				let color = colors[Math.floor(Math.random() * colors.length)]; //隨機顏色
				return color;
			});
			await delay(2000);
			set_data(res.data);
			set_random_colors(c);
			set_loading(false);
		} catch (error) {
			handle_error(error, history);
			set_loading(false);
		}
	};

	const onClick = (msg) => {
		set_msg(msg);
		set_open(true);
	};

	//載入所有文章
	React.useEffect(() => {
		update();
	}, []);

	return (
		<React.Fragment>
			<div className="row mb-4">
				<div className="col">
					<p className="ch_font text-center text-success">
						{"保持友善包容的態度和大家交流：）"}
					</p>
					<div style={{ borderRadius: "3px", overflow: "hidden" }}>
						<TextField
							style={{ backgroundColor: "#FFFFFF" }}
							className="w-100"
							label={<span className="ch_font">標題</span>}
							variant="filled"
							InputProps={{
								id: "title",
								className: "ch_font",
								onChange: onChange,
								value: title,
							}}
							placeholder="輸入你的文章標題"
						/>
						<TextField
							style={{ backgroundColor: "#F0F2F5" }}
							className="w-100 ch_font"
							label={<span className="ch_font">內容</span>}
							multiline
							rows="4"
							variant="filled"
							InputProps={{
								id: "content",
								className: "ch_font",
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={check} disabled={blocking}>
											<SendRoundedIcon fontSize="large" />
										</IconButton>
									</InputAdornment>
								),
								onChange: onChange,
								value: content,
							}}
							placeholder="想發表些什麼?"
						/>
					</div>
				</div>
			</div>
			<div className={classes.cardContainer}>
				<div className="row">
					{data.map((item, i) => {
						return (
							<div key={i} className="col-xs-12 col-sm-6 col-md-3">
								<MsgCard msg={item} color={random_colors[i]} onClick={onClick} />
							</div>
						);
					})}
				</div>
				<Backdrop className={classes.backdrop} open={loading}>
					<CircularProgress color="inherit" />
				</Backdrop>
			</div>
			<MsgDialog msg={msg} open={open} close={close} />
			<AlertDialog open={checkShow} close={close} submit={submit} blocking={blocking} />
		</React.Fragment>
	);
};

const MsgCard = function({ msg, color, onClick }) {
	const classes = useStyles();
	const { title, content, user, createdAt, comment_count } = msg;

	return (
		<Card
			className={clsx("mb-3", classes.root)}
			raised
			style={{ backgroundColor: color }}
			onClick={() => onClick(msg)}
		>
			<CardContent className="h-100 position-relative">
				<Typography
					className={clsx("ch_font", classes.title)}
					color="textSecondary"
					gutterBottom
				>
					{moment(createdAt).calendar(null, { lastWeek: "dddd HH:mm" })}
				</Typography>
				<Typography
					className="ch_font overflow-hidden"
					variant="h5"
					component="h2"
					style={{
						textOverflow: "ellipsis",
						height: "20%",
						whiteSpace: "nowrap",
					}}
				>
					{title}
				</Typography>
				<Typography
					className="mb-2 ch_font"
					color="textSecondary"
					style={{ fontSize: "0.8rem" }}
				>
					{user.user_name}
				</Typography>
				<Typography
					className="ch_font overflow-hidden"
					variant="body2"
					component="p"
					style={{
						textOverflow: "ellipsis",
						height: "40%",
						display: "-webkit-box",
						WebkitLineClamp: 4,
						WebkitBoxOrient: "vertical",
						whiteSpace: "normal",
					}}
				>
					{content}
				</Typography>
				<Typography
					className="ch_font pt-1 text-right position-absolute"
					color="textSecondary"
					style={{
						fontSize: "0.8rem",
						borderColor: "rgba(0, 0, 0, 0.54)",
						bottom: "10px",
						right: "20px",
					}}
				>
					{`${comment_count || 0} 則留言`}
				</Typography>
			</CardContent>
			<CardActions>
				<Button size="small">Learn More</Button>
			</CardActions>
		</Card>
	);
};

const MsgDialog = function({ msg, open, close }) {
	const classes = useStyles();
	const [comment_list, set_comment_list] = React.useState([]);
	const [post, set_post] = React.useState({});
	const [message, set_message] = React.useState("");
	const [loading, set_loading] = React.useState(false);
	const history = useHistory();

	//取得留言資料並刷新
	const refresh = async () => {
		set_loading(true);
		try {
			let res1 = await apiClass_get_post({ post_id: msg._id });
			let res2 = await apiClass_get_comment({ post_id: msg._id });
			set_post(res1.data);
			set_comment_list(res2.data);
			set_loading(false);
		} catch (error) {
			handle_error(error, history);
			set_loading(false);
		}
	};

	//更改留言訊息
	const onChange = (e) => {
		set_message(e.target.value);
	};

	//送出留言
	const onSubmit = async (e) => {
		set_loading(true);
		try {
			if (!message) {
				alert("留言訊息不可空白");
				set_loading(false);
				return;
			}
			if (message.length > 300) {
				alert("留言訊息不可超過300字");
				set_loading(false);
				return;
			}

			let res = await apiClass_add_comment({ post_id: msg._id, message: message });
			set_message("");
			refresh();
			set_loading(false);
		} catch (error) {
			handle_error(error, history);
			set_loading(false);
		}
	};

	if (msg && msg._id) {
		return (
			<Dialog fullWidth open={open} onEnter={refresh} onClose={close} maxWidth="md">
				<DialogTitle>
					<Typography className="ch_font pr-3" component="div" variant="h6">
						{post.title}
					</Typography>
					<Typography
						className={clsx("ch_font", classes.title)}
						color="textSecondary"
						gutterBottom
					>
						{`${post.user && post.user.user_name} - ${moment(post.createdAt).calendar(
							null,
							{
								lastWeek: "dddd HH:mm",
							}
						)}`}
					</Typography>
					<IconButton className={classes.closeButton} onClick={close}>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent className="position-relative">
					<DialogContentText className="ch_font">{post.content}</DialogContentText>
					<hr />
					<TextField
						className="w-100 ch_font"
						label={<span className="ch_font">點擊開始留言發表你的想法</span>}
						multiline
						rows="2"
						variant="standard"
						InputProps={{
							id: "content",
							className: "ch_font",
							endAdornment: (
								<InputAdornment position="end">
									<IconButton onClick={onSubmit} disabled={loading}>
										<SendRoundedIcon fontSize="large" />
									</IconButton>
								</InputAdornment>
							),
							value: message,
							onChange: onChange,
						}}
						placeholder="不可超過300字"
					/>
					<DialogContentText className="ch_font mt-3 mb-0">
						{comment_list.length > 0
							? `共 ${comment_list.length} 則留言`
							: "目前沒有同學留言"}
					</DialogContentText>
					<List className="w-100">
						{comment_list.map((item, i) => {
							return (
								<React.Fragment key={i}>
									<ListItem alignItems="flex-start">
										<ListItemAvatar>
											{item.user.email === "iamhongwei0417@gmail.com" ? (
												<Avatar
													className="ch_font"
													alt={item.user.user_name}
													src=""
													style={{
														backgroundColor: "#4caf50",
													}}
												>
													{item.user.user_name[0]}
												</Avatar>
											) : (
												<Avatar
													className="ch_font"
													alt={item.user.user_name}
													src=""
												>
													{item.user.user_name[0]}
												</Avatar>
											)}
										</ListItemAvatar>
										<ListItemText
											className="w-100"
											primary={
												<React.Fragment>
													<Typography
														component="span"
														variant="body1"
														className="ch_font"
													>
														{`${item.user.user_name} (${item.user.student_id})`}
													</Typography>
													<Typography
														component="span"
														variant="body2"
														className="ch_font"
													>
														{` - ${moment(item.createdAt).calendar()}`}
													</Typography>
												</React.Fragment>
											}
											secondary={
												<Typography
													component="span"
													variant="body2"
													className="w-100 ch_font"
													style={{ wordBreak: "break-all" }}
													color="textSecondary"
												>
													{item.message}
												</Typography>
											}
										/>
									</ListItem>
									{i !== comment_list.length - 1 ? (
										<Divider
											variant="inset"
											component="li"
											className="border-top"
										/>
									) : null}
								</React.Fragment>
							);
						})}
					</List>
				</DialogContent>
			</Dialog>
		);
	} else return null;
};

const AlertDialog = function({ open, close, submit, blocking }) {
	const classes = useStyles();

	return (
		<Dialog open={open} onClose={close} fullWidth maxWidth="md">
			<DialogTitle>
				<Typography className="ch_font" component="div" variant="h6">
					{"確定要送出嗎?"}
				</Typography>
			</DialogTitle>
			<DialogContent>
				<DialogContentText className="ch_font">
					送出後全部人都會看見你的發文，記得大家遵守網路秩序和平討論😄
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button className="ch_font" onClick={close} color="primary">
					取消
				</Button>
				<Button className="ch_font" onClick={submit} color="primary" disabled={blocking}>
					確定送出
				</Button>
			</DialogActions>
			<Backdrop open={blocking}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</Dialog>
	);
};
