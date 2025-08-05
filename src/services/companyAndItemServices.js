import { useMutation, useQuery } from "react-query"
import axios from "axios"

const addCompany = (data) => {
    return axios.post("http://localhost:9990/distributer/api/v1/public/company/addcompany", data)
}

const getCompanys = () => {
    return axios.get("http://localhost:9990/distributer/api/v1/public/company/companys")
}

const deleteCompanys = (id) => {
    return axios.delete("http://localhost:9990/distributer/api/v1/public/company/company/" + id)
}

const deleteItems = (id) => {
    return axios.delete("http://localhost:9990/distributer/api/v1/public/item/item/" + id)
}

const AddItemsByCompany = (item) => {
    return axios.post("http://localhost:9990/distributer/api/v1/public/item/additem", item)
}

const getItemsByCompany = () => {
    return axios.get("http://localhost:9990/distributer/api/v1/public/item/items")
}

export const useAddCompany = (data) => {
    return useMutation("addcompanys", addCompany, {
        retry: 5,
        retryDelay: 1000
    });
}

export const useGetCompanys = () => {
    return useQuery("getcompanys", getCompanys, {
        retry: 5,
        retryDelay: 1000
    });
}

export const useDeleteCompany = (id) => {
    return useMutation("deletecompanys", deleteCompanys, {
        retry: 5,
        retryDelay: 1000
    });
}

export const useDeleteItem = (id) => {
    return useMutation("deleteitems", deleteItems, {
        retry: 5,
        retryDelay: 1000
    });
}

export const useAdditemByCompany = (item) => {
    return useMutation("addItemByComapany", AddItemsByCompany, {
        retry: 5,
        retryDelay: 1000
    })
}

export const useGetItems = () => {
    return useQuery("getItems", getItemsByCompany, {
        retry: 5,
        retryDelay: 1000
    })
}