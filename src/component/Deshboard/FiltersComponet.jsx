import { DataGrid, GridToolbarContainer, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom'
import { useClientData } from './../../services/clientServices';
import { usevendorData } from './../../services/vendorServices';
import axios from 'axios';

const velidation = {
    type: {
        required: {
            value: true,
            message: "Search type is required.",
        },
    },
}

export const FiltersComponet = () => {

    const columns = [
        { field: "id", headerName: "ID", width: 20 },
        // { field: "_id", headerName: "", width: "0" },
        { field: "invoice", headerName: "Invoice No", width: 150 },
        { field: "vendor", headerName: "Vendor", width: 250 },
        { field: "sellbillno", headerName: "Sellbillno", width: 95 },
        { field: "date", headerName: "Date", width: 100 },
        { field: "client", headerName: "Client", width: 300 },
        { field: "paymentType", headerName: "PaymType", width: 80 },
        { field: "total", headerName: "Credit Amt", width: 80 },
        { field: "dbtamount", headerName: "Main Amt", width: 150 },
    ]

    const [rowData, setRowData] = useState([])
    const [person, setPerson] = useState([])
    const [personChange, setPersonChange] = useState("")
    const { data: clientData, isLoading: clientLoading } = useClientData();
    const { data: vendorData, isLoading: vendorLoading } = usevendorData();
    var { register, handleSubmit, formState: { errors } } = useForm();

    const submitData = async (data) => {
        data.type = personChange
        const filterData = await axios.get("http://localhost:9990/distributer/api/v1/public/sell/search", { params: data })
        console.log(" =====>> ", filterData);
        setRows(filterData?.data?.data);
    }

    var [temp1, settemp] = useState(0);
    var [temp, setTemp] = useState(0);
    var [purchaseTotal, setpurchaseTotal] = useState([])
    var [credittotal, setcredittotal] = useState(0)
    var [debittoal, setdebittoal] = useState(0)
    var totalPrices = 0;
    var [sellbilltotal, setsellbilltotal] = useState(0);
    const setRows = (data) => {
        var id = 0
        debittoal = 0
        setdebittoal(debittoal)
        credittotal = 0
        setcredittotal(credittotal)
        if (personChange === "purchase") {
            var id = 0,temp=0;
            setTemp(temp)
            const completedData = data?.map((element) => {
                temp += element?.items.map(ele => ((ele.qty * ele.price) + ((ele.qty * ele.price * ele.gstper) / 100))).reduce((accumulator, currentValue) => {
                    return accumulator + currentValue;
                }, 0)
                setTemp(temp)
                element?.items?.map(ele => ele.qty * ele.price).forEach(ele => totalPrices += ele)
                return {
                    id: ++id,
                    _id: element._id,
                    invoice: element.invoice,
                    date: element.date,
                    vendor: element?.vendorId?.vendorName,
                    total: Math.round(element?.items?.map(ele => ((ele.qty * ele.price) + ((ele.qty * ele.price * ele.gstper) / 100))).reduce((accumulator, currentValue) => {
                        return accumulator + currentValue;
                    }, 0))
                };
            });
            setRowData(completedData);
        } else {
            sellbilltotal = 0;
            setsellbilltotal(sellbilltotal);
            const completedData = data.map((element) => {
                sellbilltotal += element?.items.map(ele => ele.qty * ele.price).reduce((accumulator, currentValue) => {
                    return +accumulator + +currentValue;
                }, 0)
                setsellbilltotal(sellbilltotal);
                var date = element.date.substring(0, 10).split("-");
                date = `${date[2]}/${date[1]}/${date[0]}`;
                element?.items.map(ele => ele.qty * ele.price).forEach(ele => totalPrices += +ele)
                var mainPrice = element?.items.reduce((accumulator, currentValue) => {
                    return accumulator + (currentValue.price * currentValue.qty);
                }, 0);

                var debitlogic = element?.total=== 0 ? mainPrice : (mainPrice - (element?.total)) 
                debittoal += mainPrice
                setdebittoal(debittoal)
                // credittotal += mainPrice - (element?.total) === 0 ? mainPrice : mainPrice - (element?.total)
                credittotal +=  element?.paymentType === 1 ? mainPrice : debitlogic
                setcredittotal(credittotal)
                console.log("credit and Debit",element)
                return {
                    id: ++id,
                    _id: element._id,
                    sellbillno: element.sellbillno,
                    date: date,
                    client: element?.clientId?.name,
                    // paymentType: element.paymentType === 1 ? "Credit" : "Debit",
                    // total: mainPrice - (element?.total) === 0 ? mainPrice : mainPrice - (element?.total),
                    // dbtamount: mainPrice
                    paymentType: element.paymentType === 1 ? "Credit" : "Debit",
                    total: element?.paymentType === 1 ? mainPrice : debitlogic,
                    dbtamount: mainPrice

                };
            });
            setRowData(completedData);
        }
    };

    const changePersonHandle = (data) => {
        settemp(data)
        if (data === "sell") {
            setPerson(clientData?.data?.data)
        } else if (data === "purchase") {
            setPerson(vendorData?.data?.data?.map(item => {
                return {
                    name: item.vendorName,
                    _id: item._id
                }
            }))
        } else {
            setPerson([])
        }
        setPersonChange(data)
    }
    console.log("temp1", temp1);
    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbar />
                <h5 style={{ paddingTop: "12px", fontSize: "14px" }}>Main Amount Total: {Math.round(debittoal)} | Credit Amount Total :{Math.round(credittotal)} | Diff = {Math.round(debittoal) - Math.round(credittotal)}/-</h5>
            </GridToolbarContainer>
        );
    };
    const CustomToolbar1 = () => {
        return (
            <GridToolbarContainer>
                <GridToolbar />
                <h5 style={{ paddingTop: "12px", fontSize: "14px" }}>Total Purchase Amount :{Math.round(temp)} </h5>
            </GridToolbarContainer>
        );
    };

    useEffect(() => {
        // console.log(clientData);
        // console.log(vendorData);
    }, [clientLoading, vendorLoading, rowData])

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
                                <h3>Filters List</h3>
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
                                            filter
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <section className="section">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">All filters</h4>
                            </div>
                            <div className="card-body">
                                {
                                    clientLoading || clientData?.data?.data !== undefined ? (
                                        <form onSubmit={handleSubmit(submitData)} id='forms'>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <fieldset class="form-group mandatory">
                                                        <label htmlFor="person" class="form-label">
                                                            Select Search type
                                                        </label>
                                                        <select
                                                            class="form-select"
                                                            id="person"
                                                            value={personChange}
                                                            onChangeCapture={(event) => { changePersonHandle(event.target.value) }}
                                                            {...register("type", velidation.type)}
                                                        >
                                                            <option value="">Select search's type</option>
                                                            <option value="sell">Sell</option>
                                                            <option value="purchase">Purchase</option>
                                                        </select>
                                                        <span className="text-danger font-weight-bold">
                                                            {errors?.type?.message}
                                                        </span>
                                                    </fieldset>
                                                    <fieldset class="form-group">
                                                        <label htmlFor="person" class="form-label">
                                                            Select Persons
                                                        </label>
                                                        <select
                                                            class="form-select"
                                                            id="person"
                                                            {...register("person")}
                                                        >
                                                            <option className='search-dropdown' value="">Select Person</option>
                                                            {
                                                                person?.length === 0 ? (
                                                                    <option value="">Please select first person</option>
                                                                ) : (
                                                                    person?.map(cli => (
                                                                        <option value={cli._id}>{cli.name}</option>
                                                                    ))
                                                                )
                                                            }
                                                        </select>
                                                    </fieldset>
                                                </div>
                                                <div className="col-md-6">
                                                    <div class="form-group mandatory">
                                                        <label htmlFor="sdate" class="form-label">Start Date</label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            id="sdate"
                                                            {...register("sdate")}
                                                        />
                                                        <span className="text-danger font-weight-bold">
                                                            {errors?.date?.message}
                                                        </span>
                                                    </div>
                                                    <div class="form-group mandatory">
                                                        <label htmlFor="edate" class="form-label">End Date</label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            id="edate"
                                                            {...register("edate")}
                                                        />
                                                        <span className="text-danger font-weight-bold">
                                                            {errors?.date?.message}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-md-12 pt-2">
                                                    <button type="submit" class="btn btn-primary me-1 mt-4">Search</button>
                                                    <button type="submit" class="btn btn-secondry me-3 mt-4" onClick={() => { window.location.reload() }}>Reset</button>
                                                </div>
                                            </div>
                                        </form>
                                    ) : (
                                        <> Loading... </>
                                    )
                                }
                            </div >
                        </div >
                    </section >

                    <section className="section">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title"> Filter List</h4>
                            </div>
                            <div className="card-body">
                                {rowData.length !== 0 ? (
                                    <>
                                        <DataGrid
                                            // columnVisibilityModel={{
                                            //     status: false,
                                            //     _id: false,
                                            // }}
                                            columns={columns}
                                            rows={rowData}
                                            // slots={{ toolbar: GridToolbar }}
                                            components={{
                                                Toolbar: temp1 === "sell" ? CustomToolbar : CustomToolbar1,
                                            }}
                                        />
                                    </>
                                ) : (
                                    <div className="d-flex justify-content-center align-item-center my-5">
                                        <h6>No Data Available</h6>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section></div >
            </div >
        </>
    )
}
