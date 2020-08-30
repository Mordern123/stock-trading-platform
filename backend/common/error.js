export const handle_error = (error, res) => {
	console.log(error);
	if (!res) return;

	//http錯誤
	if (error.response) {
		res.status(error.response.status).send();
		return;
	}

	//自定義錯誤
	switch (error.message) {
		case "204": //No Content
			res.status(204).send();
			return;
		case "205": //Reset Content
			res.status(205).send();
			return;
		case "400": //Bad Request
			res.status(400).send();
			return;
		case "404": //Not Found
			res.status(404).send();
			return;
		default:
			//未知錯誤
			res.status(500).send(); //Internal Server Error
	}
};
