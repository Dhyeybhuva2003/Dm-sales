import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { useSelector } from "react-redux";

const getItemCompanyWise = (company) => {
  return axios.get(
    "http://localhost:9990/distributer/api/v1/public/item/item-by-company",
    company
  );
};

const addPurchase = (data) => {
  return axios.post(
    "http://localhost:9990/distributer/api/v1/public/purchase/add-purchase",
    data
  );
};

const getPurchase = ({fEndDate,fStartDate,fYear}) => {
  return axios.get(
    `http://localhost:9990/distributer/api/v1/public/purchase/get-purchase?startDate=${fStartDate}&endDate=${fEndDate}&fYear=${fYear}`
  );
};

const getBillNumber = (invoice) => {
  return axios.put(
    "http://localhost:9990/distributer/api/v1/public/purchase/get-bill", { data: invoice }
  );
};

export const useGetItemCompanyWise = (company) => {
  return useQuery("getItemCompanyWise", getItemCompanyWise, {
    retry: 5,
    retryDelay: 1000,
  });
};

export const useAddPurchase = () => {
  return useMutation("addPurchase", addPurchase, {
    retry: 5,
    retryDelay: 1000,
  });
};

export const useGetPurchaseData = () => {
  const { fStartDate,fEndDate } = useSelector(state=>state.purchase);
  const { fYear } = useSelector(state=>state.fYear);
  return useQuery(["getPurchaseData",fStartDate,fEndDate,fYear], () =>  getPurchase({fEndDate,fStartDate,fYear}), {
    retry: 5,
    retryDelay: 1000,
  });
};

export const useGetUniqueBillNo = (data) => {
  return useMutation("getPurchaseData", getBillNumber, {
    retry: 5,
    retryDelay: 1000,
  });
};
