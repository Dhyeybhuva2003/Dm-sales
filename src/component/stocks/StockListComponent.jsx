import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/css/style.css";
import { useSelector } from "react-redux";
import { useGetStockData } from "../../services/stockServices";

export const StockListComponent = () => {
    // var { data, isLoading } = useGetStockData();
    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "_id", headerName: "", width: "0" },
        // { field: "company", headerName: "Company name", width: 250 },
        // { field: "companyId", headerName: "", width: 0 },
        { field: "item", headerName: "Items", width: 350 },
        { field: "itemId", headerName: "", width: 0 },
        { field: "qty", headerName: "Quantity", width: 150 },
        { field: "uom", headerName: "Unit", width: 200 },
        {
            field: "actions",
            headerName: "View Items",
            width: 100,
            renderCell: (params) => (
                <>
                        {/* onClick={h} */}
                    <Link
                        to={`itemwisestock/${params.row._id}`}
                        // to={`itemwisestock/${params.row._id}?clientID=${clientID}&companyId=${companyId}`}
                    >
                        <i class="bi bi-box-arrow-up-right"></i>
                    </Link>
                </>
            ),
        },  
    ];

    const [rowData, setRowData] = useState([]);
    var [stockPrice, setstockPrice] = useState(0)
    const setRows = (data) => {
        var id = 0;
        const completedData = data.map((element) => {
            stockPrice += (element.price * element.qty);
            setstockPrice(stockPrice);
            return {
                id: ++id,
                _id: element?._id,
                company: element?.companyId?.name,
                companyId:element?.companyId?._id,
                item: element?.itemId?.name,
                itemId: element?.itemId?._id,
                qty: element?.qty,
                uom: element?.uom
            };
        });
        setRowData(completedData);
    };

    const store = useSelector((state) => state)
    const navigate = useNavigate();

    useEffect(() => {
        if (store?.stock?.value.length !== 0) {
            setRows(store.stock.value);
        } else {
            navigate("/");
        }
    }, []);

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
                                <h4 className="card-title">Stocks</h4>
                            </div>
                            <div className="card-body">
                                {rowData.length != 0 ? (
                                    <DataGrid
                                        // columnVisibilityModel={{
                                        //     status: true,
                                        //     _id: false,
                                        // }}
                                        columns={columns}
                                        rows={rowData}
                                        slots={{ toolbar: GridToolbar }}
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
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
