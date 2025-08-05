import { React, useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { useDateWiseSellBill } from "../../services/sellServices"
import { DataGrid, GridToolbarContainer, GridToolbar } from "@mui/x-data-grid";
export const DateWiseItemList = () => {
    const validation = {
        date: {
            required: {
                value: true,
                message: "Date is required.",
            },
        }
    }
    const mutation = useDateWiseSellBill();

    var { register, handleSubmit, formState: { errors } } = useForm();

    const columns = [
        {
            field: "id",
            headerName: "ID",
            width: 70,
        },
        { field: "_id", headerName: "", width: "0" },
        { field: "company", headerName: "company", width: 220 },
        { field: "item", headerName: "Items", width: 320 },
        { field: "qty", headerName: "Quantity", width: 130 },
        // { field: "price", headerName: "Price", width: 100 },
        { field: "total", headerName: "Total", width: 150 },
    ];
    const [rowData, setRowData] = useState([]);
    var [total, settotal] = useState(0)
    const setRows = (data) => {
        var id = 0; total = 0;
        settotal(total)
        var array = [];
            data?.forEach((element) => {
             total += +element?.total
                settotal(total)
                let thisData = {
                    id: ++id,
                    // _id: element?._id,
                    company: element?.companyId?.name,
                    item: element?.itemId?.name,
                    qty: element?.qty,
                    uom: element?.uom,
                    price: element?.price,
                    total: element?.total
                };
                array.push(thisData);
            });
        // });
        setRowData(array);
    };

    useEffect(() => {
        if (mutation.data && mutation.isLoading === false) {
            setRows(mutation.data.data.data);
        }
        else if (mutation.data && mutation.isLoading === true) {
            refetch()
        }
    }, [mutation.isLoading]);

    const [itemdate, setitemdate] = useState('')
    const submitData = (data) => {
        mutation.mutate(data)
        setitemdate(data.date)
    }

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbar />
                <h5 style={{ paddingTop: "10px", fontSize:"17px"}}>Date Wise Total Summary:{itemdate} | Total selling Price : {Math.round(total)}</h5>
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
                                <h3> Item Summary</h3>
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
                                <h4 className="card-title">Enter Date </h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit(submitData)} id='forms'>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label htmlFor="date" class="form-label">
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="date"
                                                {...register("date", validation.date)}
                                            />
                                            <span className="text-danger font-weight-bold">
                                                {errors?.date?.message}
                                            </span>
                                        </div>
                                        <div className="col-md-6 pt-2">
                                            <button type="submit" class="btn btn-primary me-1 mt-4">Submit</button>
                                            <button type="submit" class="btn btn-primary me-3 mt-4" onClick={() => document.getElementById("forms").reset()}>Reset</button>
                                        </div>
                                    </div>
                                </form>
                            </div >
                        </div >
                    </section >
                    <section className="section">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title"> Date Wise Quantity & Total Summary :{itemdate}</h4>
                            </div>
                            <div className="card-body">
                                {rowData.length != 0 ? (
                                    <DataGrid
                                        columnVisibilityModel={{
                                            status: true,
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
                                         <div> NO DATA AVAILABLE</div>
                                    </div>
                                )}
                                <div className="col-12 col-md-6 m-2">
                                    <h5>Total selling Price : {Math.round(total)}</h5>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}
