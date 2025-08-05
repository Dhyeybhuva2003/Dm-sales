import { React, useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { useDateWiseAddMoney, useDateWiseSellBill } from "../../services/sellServices"
import { DataGrid, GridToolbarContainer, GridToolbar } from "@mui/x-data-grid";

export const DateWiseAddMoneyList = () => {

  const validation = {
    date: {
      required: {
        value: true,
        message: "Date is required.",
      },
    }
  }
  var id = 0;
  var { register, handleSubmit, formState: { errors } } = useForm();
  const mutation = useDateWiseAddMoney();
  // console.log("Mutation: ", mutation);

  const submitData = (data) => {
    mutation.mutate(data)
  }


  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 0,
    },
    { field: "_id", headerName: "", width: "0" },
    { field: "date", headerName: "Date", width:95 },
    { field: "sellbillno", headerName: "SellBill No", width: 90 },
    { field: "clientname", headerName: "Client Name", width: 290 },
    { field: "amount", headerName: "AddAmt", width: 90 },
    { field: "paymentType", headerName: "PayMode", width: 80 },
    { field: "receiptno", headerName: "ReceiptNo ", width: 80 }
  ];
  const [rowData, setRowData] = useState([]);
  var [totals, settotals] = useState(0)
  const setRows = (data) => {
     var total=0;
    var completedData = data?.map((e) => {
     total += e?.amount
     settotals(total)
      return {
          id: ++id,
          sellbillno: e?.sellId?.sellbillno,
          clientname: e?.sellId?.clientId?.name,
          date:e?.date, 
          amount:e?.amount, 
          paymentType:e?.type, 
          receiptno:e?.receiptno 
      }
    })
    setRowData(completedData)
  }
  useEffect(() => {
    if (mutation.data && mutation.isLoading === false) {
      setRows(mutation.data.data.data);
    }
    else if (mutation.data && mutation.isLoading === true) {
      refetch()
    }
  }, [mutation.isLoading]);

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbar />
        <h5 style={{ paddingTop: "12px" }}>Date Wise Add Money Total : {totals}</h5>
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
                <h3>Date wise Add DebitMoney List</h3>
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
                      items
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
          <section className="section">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Date Wise Add Debit Money List ( For Debit Sell)</h4>
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
                <h4 className="card-title"> Date Wise AddMoney List</h4>
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
                    {/* <div
                  class="spinner-border"
                  style={{ width: "3rem", height: "3rem" }}
                  role="status"
                >
                  <span class="visually-hidden"></span>
                </div> */}
                    <h6>No Data Available</h6>
                  </div>
                )}
                <div className="col-12 col-md-6 m-2">
                  <h5>Total :{totals}</h5>
                </div>
              </div>
            </div>
          </section></div >
      </div >
    </>
  )

}
