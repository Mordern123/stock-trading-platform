pragma solidity >=0.4.22 <0.8.0;

contract StockToken {
    mapping(bytes32 => uint32) private user_tokens;
    event user_token_log(bytes32 uid, uint256 n);

    function get_token(bytes32 uid) public view returns (uint32) {
        return user_tokens[uid];
    }

    function set_token(bytes32 uid, uint32 token_number) public {
        user_tokens[uid] = token_number;
        emit user_token_log(uid, token_number);
    }

    function add_token(bytes32 uid, uint32 add_number) public {
        uint32 token = user_tokens[uid];
        uint32 total = token + add_number;
        user_tokens[uid] = total;
        emit user_token_log(uid, total);
    }
}
