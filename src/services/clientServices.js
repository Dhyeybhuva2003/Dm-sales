import axios from "axios"
import { useMutation, useQuery } from "react-query"
// import { gql } from '@apollo/client';

const getClientDataFromDb = () => {
    return axios.get("http://localhost:9990/distributer/api/v1/public/client/getclient")
}

const postClientData = (client) => {
    return axios.post("http://localhost:9990/distributer/api/v1/public/client/addclient", client)
}

const getClientById = (id) => {
    return axios.get("http://localhost:9990/distributer/api/v1/public/client/client/" + id)
}

const UpdateClient = async (data) => {
    return await axios.put("http://localhost:9990/distributer/api/v1/public/client/client/" + data.id, data.data)
}

const deleteClient = (id) => {
    return axios.delete("http://localhost:9990/distributer/api/v1/public/client/client/" + id)
}

export const useClientData = () => {

    return useQuery("getClient", getClientDataFromDb, {
        retry: 5,
        retryDelay: 2000
    })
}

export const usePostClientData = () => {

    return useMutation("postClient", postClientData, {})
}

export const useGetClientById = (id) => {
    return useQuery("getClientById", getClientById, {})
}

export const useEditClient = (id, client) => {
    return useMutation("getClientById", UpdateClient, {
        retry: 5,
        retryDelay: 2000
    })
}
export const useDeleteClient = (id) => {
    return useMutation("deleteClient", deleteClient, {
        retry: 5,
        retryDelay: 2000
    })
}