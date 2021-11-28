// @ts-ignore
import chalk from "chalk";
// @ts-ignore
import chaiAsPromised from "chai-as-promised";
import {getLcd, getWallet, instantiateContract, storeCode} from "../helpers";
import dotenv from "dotenv";

(async function main() {
    dotenv.config();

    const terra = getLcd(process.env.NETWORK!);
    console.log("created LCD client for", process.env.NETWORK);

    const deployer = getWallet(terra);
    console.log("deployer address:", deployer.key.accAddress);

    const contractCode = await storeCode(
        terra,
        deployer,
        `../artifacts/cw721_metadata_onchain.wasm`
    );

    console.log(chalk.green(`Done!`), `${chalk.blue("codeId")}=${contractCode}`);

    process.stdout.write(`Instantiating contract... `);

    const contractAddress = await instantiateContract(terra, deployer, contractCode, {
        owner: deployer.key.accAddress,
        minter: deployer.key.accAddress,
        name: "Terranauts Genesis",
        symbol: "TRNTG",
    });

    console.log(chalk.green("Done!"), `${chalk.blue("contractAddress")}=${contractAddress}`);
})();
