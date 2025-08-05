import { useGetSellData } from "../../services/sellServices";
import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbarContainer, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import "../../assets/css/style.css";

export const CreaditSellBill = () => {

    var { data, isLoading } = useGetSellData();

    const columns = [
        {
            field: "id",
            headerName: "ID",
            width: 70,
        },
        { field: "_id", headerName: "", width: "0" },
        { field: "sellbillno", headerName: "Bill no", width: 100 },
        { field: "date", headerName: "Date", width: 115 },
        { field: "client", headerName: "Client", width: 340 },
        { field: "paymentType", headerName: "PaymentType", width: 100 },
        { field: "total", headerName: "Amount", width: 150 },
        // { field: "total", headerName: "Total price", width: 150 },
        {
            field: "actions",
            headerName: "View Items",
            width: 100,
            renderCell: (params) => (
                <button
                    className="btn btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#primaryItems"
                // onClick={() => handleButtonClick(params.row._id)}
                >
                    <i class="bi bi-box-arrow-up"></i>
                </button>
            ),
        },
    ];

    const [rowData, setRowData] = useState([]);

    var [creditprice, setcreditprice] = useState(0)
    const setRows = (data) => {
        var id = 0;
        const completedData = data.filter(element => element.paymentType === 1).map(element => {
            creditprice += element?.items.map(ele => ele.qty * ele.price).reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
            }, 0)
            setcreditprice(creditprice);
            var date = element.date.substring(0, 10).split("-");
            date = `${date[2]}/${date[1]}/${date[0]}`;
            //   id += 1;
            return {
                id: ++id,
                _id: element._id,
                sellbillno: element.sellbillno,
                date: date,
                client: element?.clientId?.name,
                paymentType: element.paymentType === 1 ? "Credit" : null,
                total: Math.round(element?.items.map(ele => ele.qty * ele.price).reduce((accumulator, currentValue) => {
                    return accumulator + currentValue;
                }, 0))
            };
        })
        setRowData(completedData);
    };

    useEffect(() => {
        if (data && isLoading === false) {
            setRows(data?.data?.data);
        }
    }, [isLoading]);

    const CustomToolbar = () => {
        return (
          <GridToolbarContainer>
            <GridToolbar />
            <h5 style={{paddingTop:"12px"}}>CreditSell Bill List Total: {Math.round(creditprice)}</h5>
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
                                <h3>Credit Bill List</h3>
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
                                            sell
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <section className="section">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Enter Client wise Bill</h4>
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
                                        components={{
                                            Toolbar: CustomToolbar,
                                          }}
                                    />
                                ) : (
                                    <div className="d-flex justify-content-center align-item-center my-5">
                                        <div
                                            class="spinner-border"
                                            style={{ width: "3rem", height: "3rem" }}
                                            role="status"
                                        >
                                            <span class="visually-hidden"></span>
                                        </div>
                                    </div>
                                )}
                                <div className="col-12 col-md-6 m-2">
                                    <h5>Total credit Bill Price : {Math.round(creditprice)}</h5>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}
