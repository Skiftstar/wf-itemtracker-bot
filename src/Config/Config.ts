import { readFileSync, readdir } from "fs";

const config = JSON.parse(readFileSync('./config/config.json', 'utf-8'))

export const getConfigValue = (path: string) => {
    const keys = path.split(".")
    let currVal = config;
    for (const key of keys) {
        currVal = currVal[key]
    }
    return currVal;
}