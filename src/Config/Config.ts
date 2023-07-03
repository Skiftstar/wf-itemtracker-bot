import { readFileSync, writeFileSync } from "fs";
import { beautifyJSON } from "../Util/Util";

const config = JSON.parse(readFileSync('./config/config.json', 'utf-8'))
const clientConfig = JSON.parse(readFileSync('./config/clientConfig.json', 'utf-8'))

export const getConfigValue = (path: string) => {
    const keys = path.split(".")
    let currVal = config;
    for (const key of keys) {
        currVal = currVal[key]
    }
    return currVal;
}

export const setConfigValue = (path: string, value: any) => {
    const keys = path.split(".")
    let currVal = config;
    keys.forEach((key, index) => {
        if (index < keys.length - 1) {
            if (!(key in currVal)) {
                currVal[key] = {}
            }
            currVal = currVal[key]
        } else {
            currVal[key] = value
            writeConfig()
        }
    })
}

export const getClientValue = (key: string) => {
    return clientConfig[key]
}

const writeConfig = () => {
    writeFileSync('./config/config.json', beautifyJSON(JSON.stringify(config)))
}