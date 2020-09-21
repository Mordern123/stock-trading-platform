//字串轉換成數值
export const to_num = (str) => {
	let n = str.split(",").join(""); //去除逗點
	n = parseFloat(n);

	if (isNaN(n)) {
		return "0";
	} else {
		return n.toString();
	}
};

//含有K的字串轉換為數值(for鉅亨網)
export const K_to_num = (str) => {
	if (str.includes("K")) {
		let n = to_num(str.replace("K", ""));
		return (n * 1000).toString();
	} else {
		return to_num(str);
	}
};

//處理漲跌字串
export const to_ud = (str) => {
	if (str.includes("-")) {
		return to_num(str);
	} else {
		let n = to_num(str);
		return n === 0 ? "+" + n : n.toString();
	}
};

//轉換收盤資料格式
export const closing_data_to_stock_info = (closing_data) => {
	let stock_info = {
		website: "close",
		stock_id: closing_data.stock_id,
		stock_name: closing_data.stock_name,
		v: parseInt(parseInt(to_num(closing_data.trading_volume)) / 1000), //累積成交量(張數)
		o: to_num(closing_data.opening_price), //開盤
		h: to_num(closing_data.highest_price), //當日最高
		l: to_num(closing_data.lowest_price), //當日最低
		z: to_num(closing_data.closing_price), //收盤價
		y: to_num(closing_data.closing_price), //昨收(已收盤和收盤價一樣)
		ud: closing_data.up_down + closing_data.up_down_spread || 0, //漲跌
		request_time: closing_data.data_time,
	};

	return stock_info;
};
