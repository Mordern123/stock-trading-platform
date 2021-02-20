import Web3 from "web3";
require("dotenv").config();
console.log(process.env.WEB3_PROVIDER_URL);
const provider = new Web3.providers.WebsocketProvider(process.env.WEB3_PROVIDER_URL);
var web3 = new Web3(provider);
console.log("web3 is connected");

// //取得web3
// export const get_web3 = async () => {
// 	const provider = new web3.providers.HttpProvider(process.env.WEB3_PROVIDER_URL);
// 	let _web3 = new web3(provider);
// 	const id = await _web3.eth.net.getId();
// 	console.log(id);
// 	return _web3;
// };

//取得合約實體
export const getContractInstance = async (contractDefinition, address) => {
	// get network ID and the deployed address
	const networkId = await web3.eth.net.getId();
	const deployedAddress = address || contractDefinition.networks[networkId].address;

	// create the instance
	const instance = new web3.eth.Contract(contractDefinition, deployedAddress);
	return instance;
};

//呼叫合約call
export const contract_call = async (contract, method, params = [], options = {}) => {
	try {
		let result = await contract.methods[method](...params).call(options);
		return result;
	} catch (error) {
		console.log(error);
		return false;
	}
};

//呼叫合約send
export const contract_send = async (contract, method, params) => {
	try {
		let accounts = await web3.eth.getAccounts();
		let result = await contract.methods[method](...params).send({
			from: accounts[Math.floor(Math.random() * accounts.length)], //random account
			gas: 6000000,
		});
		return result;
	} catch (error) {
		console.log(error);
		return false;
	}
};

export const string_to_bytes32 = (s) => {
	let s_hex = web3.utils.stringToHex(s);
	let s_bytes = web3.utils.padRight(s_hex, 64); // ? 0x0000....共補滿(32*2)-2個位元
	return s_bytes;
};

export const bytes32_to_string = (b) => {
	let b_string = web3.utils.hexToString(b);
	return b_string;
};

//
