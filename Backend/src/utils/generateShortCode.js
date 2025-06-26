const { customAlphabet } = require("nanoid");

// 6-character alphanumeric string
const alphabet = "1234567890abcdefghijklmnopqrstuvwxyz";
const generateCode = customAlphabet(alphabet, 6);

module.exports = generateCode;
