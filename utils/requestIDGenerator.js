const { v4: uuidv4 } = require("uuid");

const generateRequestID = () => {
  return uuidv4();
};

module.exports = { generateRequestID };
