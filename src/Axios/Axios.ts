import axios from "axios";

export const fetchData = () => {
    return axios.get('https://api.warframestat.us/items')
}