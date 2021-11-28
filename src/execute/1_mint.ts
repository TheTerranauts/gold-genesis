import {getLcd, getWallet, sendTransaction,} from "../helpers";
import fs from "fs";
import path from "path";
import {chunk} from "../utils/utils";
import chalk from "chalk";
import {Msg, MsgExecuteContract} from "@terra-money/terra.js";

const _ = require('lodash');

const metadata = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', '/metadata.json'), 'utf8'));
const owners = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', '/snapshot.json'), 'utf8'));

type Mint = {
    owner: string;
    token_id: string;
    token_uri: string,
    extension: Metadata,
};

type Metadata = {
    image: string;
    description: string,
    name: string,
    attributes: Trait[];
};

type Trait = {
    trait_type: string;
    value: string;
};

(async function main() {
    const terra = getLcd(process.env.NETWORK!);
    console.log("created LCD client for", process.env.NETWORK);

    const deployer = getWallet(terra);
    console.log("deployer address:", deployer.key.accAddress);

    const mints: Mint[] = [];

    metadata.forEach((meta, index) => {
        mints.push(
            {
                owner: owners[index] as string,
                token_id: `${meta["edition"]}`,
                token_uri: `ipfs://QmNVN179S9ABcekC56CgLPGBnZoxRVHbmRv9q7yosNpTsi/${meta["edition"]}.json`,
                extension: {
                    image: meta["image"],
                    name: meta["name"],
                    description: meta["description"],
                    attributes: []
                }
            },
        )
    })

    const contractMessages: Msg[] = mints.map( it => {
        return new MsgExecuteContract(deployer.key.accAddress, process.env.NFT_CONTRACT_ADDRESS!, {
            mint: it
        });
    });

    // const messages = chunk(contractMessages, 50);

    console.log(chalk.green(`Minting`))
    await sendTransaction(terra, deployer, contractMessages);

    console.log(chalk.green("Done!"), `${chalk.blue("All minted")}`);
})();
