import { configureStore } from "@reduxjs/toolkit";
import companyStore from "./CompanySlice"
import itemStore from "./ItemSlice"
import stockStore from "./StockSlice"
import PurchaseStore from "./PurchaseSlice";
import sellStore from './SellSlice'
import clientStore from "./ClientSlice";
import vendorStore from "./vendorSlice";
import sellPriceHistoryStore from "./sellPriceHistorySlice";
import FinancialYearSlice from "./FinancialYearSlice";

export const store = configureStore({
    reducer: {
        company: companyStore,
        items: itemStore,
        stock: stockStore,
        purchase: PurchaseStore,
        sell: sellStore,
        client: clientStore,
        vendor: vendorStore,
        sellPriceHistory : sellPriceHistoryStore,
        fYear: FinancialYearSlice
    }
})