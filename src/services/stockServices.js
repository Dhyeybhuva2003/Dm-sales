import axios from "axios"
import { useMutation, useQuery } from "react-query"

const getStock = () => {
    return axios.get("http://localhost:9990/distributer/api/v1/public/stock/stock")
}


const stockhistory = (id) => {
    // console.log("id param", id.itemId);
    return axios.put("http://localhost:9990/distributer/api/v1/public/stock/stock-history/" + id.itemId)
}

export const useGetStockData = () => {
    return useQuery("getStockData", getStock, {
        retry: 5,
        retryDelay: 1000
    })
}

export const useHistoryData = () => {
    return useMutation("usehistory", stockhistory, {
        retry: 5,
        retryDelay: 1000
    })
}