import axios from "axios";

export const fetchData = () => {
    return axios.get('https://api.warframestat.us/items')
}

export const testWikiPage = async (url: string): Promise<boolean> => {
    console.log(url)
    const response = await axios.get(url).catch(err => {
        // console.log(err)
    })
    if (!response) {
        return false;
    }
    return response.status === 200
    // return (await axios.get(url)).status === 200
  };