import ErrorHandle from "../models/error_handle_model";


const add_error = async (user_id,msg,type,website)=>{
	const add = await new ErrorHandle({
		user:user_id,
		error_msg:msg,
		operation_type:type,
        website:website,
	}).save();
	return add._id;
	console.log(add);
}


export default add_error;