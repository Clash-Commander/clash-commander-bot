require("dotenv").config();
const { connect } = require('mongoose');
const { ChalkAdvanced } = require("chalk-advanced");

module.exports = async () => {
    const { MONGODB_HOST, MONGODB_PORT, MONGODB_DATABASE } = process.env;
    const uri = `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}?retryWrites=true`;

    console.log(
        `${ChalkAdvanced.white("MongoDB")} ${ChalkAdvanced.gray(
            ">",
        )} ${ChalkAdvanced.yellow("Attempting to connect to MongoDB...")}`,
    );

    try {
        await connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(
            `${ChalkAdvanced.white("MongoDB")} ${ChalkAdvanced.gray(
                ">",
            )} ${ChalkAdvanced.green("Connected to MongoDB successfully!")}`,
        );
    } catch (error) {
        console.error(
            `${ChalkAdvanced.white("MongoDB")} ${ChalkAdvanced.gray(
                ">",
            )} ${ChalkAdvanced.red("Failed to connect to MongoDB.")}`,
        );
        console.error(error);
    }
};
