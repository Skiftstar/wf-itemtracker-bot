import axios from "axios";
import { GamePlatform } from "../Types/Types";

export const fetchData = () => {
    return axios.get('https://api.warframestat.us/items')
}

export const testWikiPage = async (url: string): Promise<boolean> => {
    console.log(url)
    const response = await axios.get(url).catch(err => {
    })
    if (!response) {
        return false;
    }
    return response.status === 200
  };

export const fetchWorldState = (platform: GamePlatform) => {
    return axios.get(`https://api.warframestat.us/${platform}`)
}