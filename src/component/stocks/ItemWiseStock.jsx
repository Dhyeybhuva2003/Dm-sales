import { useHistoryData } from "../../services/stockServices";
import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import { Link, useParams } from "react-router-dom";
import "../../assets/css/style.css";
import { useMutation } from "react-query";

export const ItemWiseStock = () => {

    var id = useParams();
    var mutation = useHistoryData();

    const columns = [
        { field: "id", headerName: "ID", width: 15 },
        { field: "_id", headerName: "", width: "0" },
        { field: "type", headerName: "Type", width: 80 },
        { field: "date", headerName: "Date", width: 100 },
        // { field: "company", headerName: "Company", width: 180 },
        // { field: "item", headerName: "Items", width: 310 },
        { field: "inQty", headerName: "Quantity", width: 70 },
        { field: "currentQty", headerName: "Current Stock", width: 100 }
    ]

    const [debit, setDebit] = useState([]);
    const [credit, setCredit] = useState([]);
    const [rowData, setRowData] = useState([]);
    var [stockPrice, setstockPrice] = useState(0);



    var temp = true;
    var currentQty = 0;
    const setRows = (data) => {
        var id = 0;
        // data.forEach(element => {
        //     if(element.type === "purchase" )
        // });
        const groupedData = data.reduce((result, element) => {
            const existingEntry = result.find((entry) => entry.date === element.date);

            if (existingEntry) {
                existingEntry.currentQty +=
                    element.type === "purchase" ? element.inQty : -element.inQty;
            } else {
                result.push({
                    id: ++id,
                    _id: element?._id,
                    date: element?.date,
                    type: element?.type,
                    // company: element?.company?.name,
                    // item: element?.item?.name,
                    inQty: element?.inQty,
                    currentQty:
                        element.type === "purchase" ? element.inQty : -element.inQty,
                });
            }
            return result;
        }, []);
        // setRowData(groupedData);
        const completedData = data?.map((element) => {
            if (temp === true) {
                currentQty = data[0].inQty;
                temp = false
            } else {
                currentQty = element.type === "purchase" ? (currentQty + element?.inQty) : (currentQty - element?.inQty)
                console.log("=======> ", currentQty);
            }
            return {
                id: ++id,
                _id: element?._id,
                date: element?.date,
                type: element?.type,
                // company: element?.company?.name,
                // item: element?.item?.name,
                inQty: element?.inQty,
                // currentQty: element.type === "purchase" ? (element?.inQty + currentQty) : (currentQty - element?.inQty)
                currentQty: currentQty,
            };
        });
        setRowData(completedData);
    };

    useEffect(() => {
        if (!mutation.data && mutation.isLoading === false) {
            mutation.mutate(id)
        }
        if (mutation.data && mutation.isLoading === false) {
            setRows(mutation.data?.data?.data);
        }
    }, [mutation.isLoading]);


    console.log("mutation.data?.data?.data",mutation.data?.data?.data);
    
    const CustomToolbar = () => {
        return (
          <GridToolbarContainer>
            <GridToolbar />
            <h4 style={{ paddingTop: "12px" }}>Company:{mutation.data?.data?.data?.[0]?.company?.name}</h4>
            <h4 style={{ paddingTop: "12px" }}>Item:{mutation.data?.data?.data?.[0]?.item?.name}</h4>
          </GridToolbarContainer>
        );
      };

    return (
        <>
            <div id="main">
                <header className="mb-3">
                    <a href="#" className="burger-btn d-block d-xl-none">
                        <i className="bi bi-justify fs-3" />
                    </a>
                </header>
                <div className="page-heading">
                    <div className="page-title">
                        <div className="row">
                            <div className="col-12 col-md-6 order-md-1 order-last">
                                <h3>Stocks</h3>
                            </div>
                            <div className="col-12 col-md-6 order-md-2 order-first">
                                <nav
                                    aria-label="breadcrumb"
                                    className="breadcrumb-header float-start float-lg-end"
                                >
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/">Deshboard</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            stock
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <section className="section">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Item Wise Stock Histroy</h4>
                            </div>
                            <div className="card-body">
                                {rowData.length != 0 ? (
                                    <DataGrid
                                        columnVisibilityModel={{
                                            status: false,
                                            _id: false,
                                        }}
                                        columns={columns}
                                        rows={rowData}
                                        // slots={{ toolbar: GridToolbar }}
                                        components={{
                                            Toolbar: CustomToolbar,
                                        }}
                                    />
                                ) : (
                                    <div className="d-flex justify-content-center align-item-center my-5">
                                        <h6>No Data Available</h6>
                                    </div>
                                )}
                                {/* <div className="col-12 col-md-6 m-2">
                                <h5>Stock's total price : {stockPrice}</h5>
                            </div> */}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}