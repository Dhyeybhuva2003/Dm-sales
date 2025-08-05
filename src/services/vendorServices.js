import axios from "axios";
import { useMutation, useQuery } from "react-query";

const getVendorDataFromDb = () => {
    return axios.get("vendor/getvendor")
}

const postVendorData = (vendor) => {
    return axios.post("vendor/addvendor", vendor)
}

const UpdateVendor = async (data) => {
    return await axios.put("vendor/vendor/" + data.id, data.data)
}

const deleteVendor = (id) => {
    return axios.delete("vendor/vendor/" + id)
}

export const usevendorData = () => {

    return useQuery("getVendor", getVendorDataFromDb, {
        retry: 5,
        retryDelay: 1000
    })
}

export const usePostvendorData = () => {
    return useMutation("postData", postVendorData, {})
}
export const useEditVendor = (id, vendor) => {
    return useMutation("getVendorById", UpdateVendor, {
        retry: 5,
        retryDelay: 2000
    })
}
export const useVendorData = () => {

    return useQuery("getVendor", getVendorDataFromDb, {
        retry: 5,
        retryDelay: 2000
    })
}
export const useDeleteVendor = () => {
    return useMutation("deleteVendor", deleteVendor, {
        retry: 5,
        retryDelay: 2000
    })
}

