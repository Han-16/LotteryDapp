require("dotenv").config();
const envType = process.env.NODE_ENV || "development";
const database = require("./db-config.json")[envType];

module.exports = {
    database : database,
    blockchain: {
        development: "http://localhost:8545",
        sepolia: "https://ethereum-sepolia-rpc.allthatnode.com/qNefFmvTBFfAwKBVzwrBb0wkFPY3yXb4",
    }
};