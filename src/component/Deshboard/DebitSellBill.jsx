import { useChangeDate, useGetSellData, useGetSellPriceHistory } from "../../services/sellServices";
import { useForm } from "react-hook-form"
import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbarContainer, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import "../../assets/css/style.css";
import { useUpdateDebitMoney } from "../../services/sellServices"
// import { Mutation } from "react-query";

export const DebitSellBill = () => {

  const validation = {
    debitMoney: {
      required: {
        value: true,
        message: "Please Add Money"
      },
    },
    type: {
      required: {
        value: true,
        message: "Please select the payment type."
      },
    },
    date: {
      required: {
        value: true,
        message: "Please select the Date."
      },
    },
    changedate: {
      required: {
        value: true,
        message: "Please select the date to change"
      }
    }

  }



  var [rowId, setrowId] = useState("")
  var { register, handleSubmit, formState: { errors } } = useForm();
  var { register:register1, handleSubmit:handleSubmit1, formState: { errors } } = useForm();
  const { data, isLoading, refetch } = useGetSellData();
  const { data: sellHistoryData, isLoading: sellHistoryLoading, refetch: historyRefetch } = useGetSellPriceHistory();
  var [adddebittotal, setadddebittotal] = useState(0)
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 15,
    },
    // { field: "_id", headerName: "", width: "0" },
    // { field: "sellbillnoId", headerName: "", width: 0 },
    { field: "sellbillno", headerName: "Bill no", width: 75 },
    { field: "date", headerName: "Date", width: 110 },
    // { field: "clientId", headerName: "", width: 0 },
    { field: "client", headerName: "Client", width: 330 },
    { field: "paymentType", headerName: "PaymentType", width: 100 },
    { field: "total", headerName: "Amount", width: 115 },
    { field: "mainTotal", headerName: "Main_Amount", width: 110 },
    {
      field: "actions",
      headerName: "View Items",
      width: 100,
      renderCell: (params) => (
        <>
          <button
            className="btn btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#primaryItems"
            // onClick={() => handleButtonClick(params.row._id, params.row.total,params.row.clientId,params.row.sellbillnoId)}
            onClick={() => handleButtonClick(params.row._id, params.row.total)}
          >
            <i class="bi bi-box-arrow-up"></i>
          </button>
          <button
            type="button"
            className="btn btn-sm"
            data-bs-toggle="modal"
            data-bs-target={`#primary`}
            onClick={() => handleHistory(params.row._id)}
          >
            <i class="bi bi-card-text text-primary"></i>
          </button>
        </>
      ),
    },
  ];

  const [rowData, setRowData] = useState([]);
  const [rowData1, setRowData1] = useState([]);
  var [debitsellhistory, setdebitsellhistory] = useState(0)
  const [client, setclient] = useState("")
  const [sellbillno, setsellbillno] = useState("")

  var [debitprice, setdebitprice] = useState(0)
  var [totaldebitprice, settotaldebitprice] = useState(0)
  const setRows = (data) => {
    var id = 0;
    const completedData = data.filter(element => element.paymentType === 0).map(element => {
      debitprice += +element?.total;
      setdebitprice(debitprice);
      totaldebitprice += +element?.items?.map(ele => ele.qty * ele.price).reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0)
      settotaldebitprice(totaldebitprice)
      var date = element.date.substring(0, 10).split("-");
      date = `${date[2]}/${date[1]}/${date[0]}`;
      //   id += 1;
      return {
        id: ++id,
        _id: element._id,
        sellbillno: element.sellbillno,
        date: date,
        client: element?.clientId?.name,
        paymentType: element.paymentType === 0 ? "Debit" : "?",
        total: Math.round(element?.total),
        mainTotal: Math.round(element?.items?.map(ele => ele.qty * ele.price).reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0))
      };
    })
    setRowData(completedData);
  };


  //----------------------------------------------------------------

  const column1 = [
    {
      field: "id",
      headerName: "ID",
      width: 30,
    },
        { field: "_id", headerName: "", width: "0" },
    { field: "date", headerName: "Date", width: 110 },
    { field: "type", headerName: "Type", width: 100 },
    { field: "total", headerName: "Amount", width: 100 },
    { field: "receiptNo", headerName: "Receipt No", width: 100 },
    {
      field: "actions",
      headerName: "View Items",
      width: 100,
      renderCell: (params) => (
        <>
          <button
            type="button"
            className="btn btn-sm"
            data-bs-toggle="modal"
            data-bs-target={`#primaryDateChange`}
            onClick={() =>ChangeDateid(params.row._id)}
          >
            <i class="bi bi-box-arrow-up"></i>
          </button>
        </>
      ),
    },
  ]

  const handleHistory = (data) => {
    setrowId(data)
    setclient(rowData.filter((itm) => itm._id === data).map(e => e?.client))
    setsellbillno(rowData.filter((itm) => itm._id === data).map(e => e?.sellbillno))
    debitsellhistory = 0
    setdebitsellhistory(debitsellhistory)
    var id1 = 0
    var sellHistorys = sellHistoryData?.data?.data?.filter(a => a.sellId === data).map((d) => {
      debitsellhistory += d?.amount;
      setdebitsellhistory(debitsellhistory);
      var date = d.date.substring(0, 10).split("-");
      date = `${date[2]}/${date[1]}/${date[0]}`;
      return {
        id: ++id1,
        _id: d._id,
        date: date,
        type: d?.type,
        total: d?.amount,
        receiptNo: d?.receiptno
      }
    })
    setRowData1(sellHistorys)
  }
  //----------------------------------------------------------------



  var mutation = useUpdateDebitMoney();
  var mutation1=useChangeDate();
  const adddebitPrice = (data) => {
    data._Id = debitpriceid;
    mutation.mutate(data)
    document.getElementById("forms").reset();
    // window.location.reload();
  }


  const changeDate = (data) => {
    data._Id = changedate;
    mutation1.mutate(data)
    document.getElementById("forms").reset();
    // window.location.reload();  
  }



  var [note, setnote] = useState(1)
  useEffect(() => {
    if (data && isLoading === false && note === 1) {
      refetch();
      setRows(data?.data?.data);
      setnote(0)
    }
    else if (mutation.data && mutation.isLoading === true) {
      refetch()
      historyRefetch();
    }
    else if (sellHistoryData?.data?.data.length !== 0 && sellHistoryLoading === false && sellHistoryData?.data?.data !== undefined && note !== 0) {
      var amount = 0;
      sellHistoryData?.data?.data?.filter(d => d.sellId === rowId).map((d) => {
        amount += d.amount
      })
      setadddebittotal(amount)
    }
  }, [isLoading, mutation, sellHistoryLoading]);

  const [debitpriceid, setdebitpriceid] = useState("")
  const handleButtonClick = (id) => {
    console.log("other ID",id);
    setdebitpriceid(id);
  }
  const [changedate, setchangedate] = useState("")
  const ChangeDateid = (id) => {
    setchangedate(id);
  }

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbar />
        <h5 style={{ paddingTop: "12px" }}>DebitSell Bill List Total: {Math.round(debitprice)}</h5>
      </GridToolbarContainer>
    );
  };
  const CustomToolbar1 = () => {
    return (
      <GridToolbarContainer>
        <GridToolbar />
        <h5 style={{ fontSize: "14px" }}>DebitSell Bill List Total:{debitsellhistory} | SellbillNo :{sellbillno} | ClientName :{client}</h5>
        <h3 style={{ fontSize: "14px", color: "black" }}><b>Erp</b> ( Sammati Market, Ambaji Highway, Khedbrahma SK ) |</h3>
        <h3 style={{ fontSize: "14px", color: "black" }}>Pro.Darshitbhai M. Raval | Mo. 9724384019</h3>
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
                <h3>Debit Bill List</h3>
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
                    // slots={{ toolbar: GridToolbar }}
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
                  <h5>| Total Debit Bill Price : {Math.round(debitprice)}</h5>
                  <h5>| Total for Main_Amount of Debit Sell : {Math.round(totaldebitprice)}</h5>
                  <h5></h5>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div
        class="modal fade text-left"
        id="primaryItems"
        tabindex="-1"
        aria-labelledby="myModalLabel120"
        style={{ display: "none" }}
        aria-hidden="true"
      >
        <div
          class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
          role="document"
        >
          <div class="modal-content">
            <div class="modal-header bg-primary">
              <h4 class="modal-title text-black" id="myModalLabel16">Add Money for Debit</h4>
              <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div class="modal-body">
              <div className="card-content">
                <div className="table-responsive">
                  <form onSubmit={handleSubmit(adddebitPrice)} id='forms'>
                    <div className="col-md-12 px-2">
                      <div class="form-group mandatory">
                        <label for="addDebitMoney" class="form-label">Add Amount</label>
                        <input type="number"
                          id="addDebitMoney"
                          class="form-control"
                          placeholder="Add Debit amount"
                          name="fname-column"
                          data-parsley-required="true"
                          {...register("debitMoney", validation.debitMoney)}
                        />
                        <span className="text-danger font-weight-bold">
                          {errors?.debitMoney?.message}
                        </span>
                      </div>
                      <div class="form-group mandatory">
                        <label for="date" class="form-label">Date</label>
                        <input type="date"
                          id="date"
                          class="form-control"
                          data-parsley-required="true"
                          {...register("date", validation.date)}
                        />
                        <span className="text-danger font-weight-bold">
                          {errors?.date?.message}
                        </span>
                      </div>
                      <fieldset class="form-group mandatory">
                        <label htmlFor="paymentMode" class="form-label">Select Payment Mode</label>
                        <select class="form-select" id="type"
                          {...register("type", validation.type)}>
                          <option value="">Select PaymentMode</option>
                          <option value="Cash">Cash</option>
                          <option value="UPI">UPI</option>
                          <option value="Cheque">Cheque</option>
                          <option value="Credit Card">Credit Card</option>
                          <option value="Debit Card">Debit Card</option>
                        </select>
                        <span className="text-danger font-weight-bold">
                          {errors?.type?.message}
                        </span>
                      </fieldset>
                      <div class="form-group mandatory">
                        <label for="receiptno" class="form-label">Receipt No</label>
                        <input type="string"
                          id="receiptno"
                          class="form-control"
                          {...register("receiptno")}
                        />
                      </div>
                      <div className="d-flex flex-row-reverse">
                        <button type="submit"
                          class="btn btn-primary w-25"
                          data-bs-dismiss={errors?.type?.message?.length !== 0 ? "no" : "modal"}
                        >Add
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-light-secondary" data-bs-dismiss="modal">
                <i class="bx bx-x d-block d-sm-none"></i>
                <span class="d-none d-sm-block">Close</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------- */}
      <div
        class="modal fade text-left"
        id="primaryDateChange"
        tabindex="-1"
        aria-labelledby="myModalLabel120"
        style={{ display: "none" }}
        aria-hidden="true"
      >
        <div
          class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
          role="document"
        >
          <div class="modal-content">
            <div class="modal-header bg-primary">
              <h4 class="modal-title text-black" id="myModalLabel16">Change Date for Add Money</h4>
              <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div class="modal-body">
              <div className="card-content">
                <div className="table-responsive">
                  <form onSubmit={handleSubmit1(changeDate)} id='forms'>
                    <div className="col-md-12 px-2">
                      <div class="form-group mandatory">
                        <label for="addDebitMoney" class="form-label">Change Date</label>
                        <input type="date"
                          id="addDebitMoney"
                          class="form-control"
                          placeholder="select date"
                          name="fname-column"
                          data-parsley-required="true"
                          {...register1("date", validation.changedate)}
                        />
                        <span className="text-danger font-weight-bold">
                          {errors?.changedate?.message}
                        </span>
                      </div>
                      <div className="d-flex flex-row-reverse">
                        <button type="submit"
                          class="btn btn-primary w-20"
                          data-bs-dismiss={errors?.type?.message?.length !== 0 ? "no" : "modal"}
                        >Change Date
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-light-secondary" data-bs-dismiss="modal">
                <i class="bx bx-x d-block d-sm-none"></i>
                <span class="d-none d-sm-block">Close</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      <div class="modal fade text-left w-100" id="primary" tabindex="-1" aria-labelledby="myModalLabel16" style={{ "display": "none" }} aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl" role="document">
          <div class="modal-content">
            <div class="modal-header bg-primary">
              <h5 className="modal-title white" id="myModalLabel160">
                Add Money History for Debit Sell
              </h5>
            </div>
            <div className="modal-body">
              {rowData1.length != 0 ? (
                <DataGrid
                  columnVisibilityModel={{
                    status: false,
                    _id: false,
                  }}
                  columns={column1}
                  rows={rowData1}
                  // slots={{ toolbar: GridToolbar }}
                  components={{
                    Toolbar: CustomToolbar1,
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
            </div>
            <div className="modal-footer">
              <div className="text-left m-4">
                <b>Total Add Money for Debit Sell : {Math.round(debitsellhistory)}</b>
              </div>
              <button
                type="button"
                className="btn btn-light-secondary"
                data-bs-dismiss="modal"
              >
                x
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
