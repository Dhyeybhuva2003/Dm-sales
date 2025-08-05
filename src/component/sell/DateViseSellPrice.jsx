import { React, useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { useDateWiseSellBill, useDateWiseSellBillprice } from "../../services/sellServices"
import { DataGrid, GridToolbarContainer, GridToolbar } from "@mui/x-data-grid";
export const DateViseSellPrice = () => {


  const validation = {
    date: {
      required: {
        value: true,
        message: "Date is required.",
      },
    }
  }
  var id = 0
  var { register, handleSubmit, formState: { errors } } = useForm();
  const [datewiseselllist, setdatewiseselllist] = useState([])
  const mutation = useDateWiseSellBillprice();
  // console.log("Mutation:::: ", mutation);

  const submitData = (data) => {
    mutation.mutate(data)
    setitemdate(data.date)
  }

  var [item, setitem] = useState([])
  var [sellupipayment, setsellupipayment] = useState([])
  var [cash, setcash] = useState([])
  var [Cheque, setCheque] = useState([])
  var [debit, setdebit] = useState([])
  var [itemdate, setitemdate] = useState('')

  var [rowData, setRowData] = useState([]);
  var [total, settotal] = useState(0)

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
    },
    { field: "_id", headerName: "", width: "0" },
    { field: "sellbillno", headerName: "Sellbillno", width: 200 },
    { field: "paymentType", headerName: "PaymentType", width: 200 },
    { field: "paymentMode", headerName: "PaymentMode", width: 200 },
    { field: "total", headerName: "Total", width: 150 },
  ];

  const setRows = (data) => {
    var id = 0; total = 0;
    var array = [];
    settotal(total)
    data?.forEach((element1) => {
      total += +((element1?.items || []).reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.price * currentValue.qty);
      }, 0));
      settotal(total)
      let thisData = {
        id: ++id,
        _id: element1?._id,
        sellbillno: element1?.sellbillno,
        paymentType: element1?.paymentType === 1 ? "Credit" : "Debit",
        paymentMode: element1?.paymentMode === "" ? "--" : element1.paymentMode,
        total: Math.round(((element1?.items || []).reduce((accumulator, currentValue) => {
          return accumulator + (currentValue.price * currentValue.qty);
        }, 0))
        )

      };
      array.push(thisData);
    });
    setRowData(array);
  };

  const [note, setnote] = useState(true)
  useEffect(() => {
    if (mutation?.data && mutation?.isLoading === false && note) {
      setnote(false)
      setRows(mutation?.data?.data?.data)
      item = mutation?.data?.data?.data;
      setitem(item)
      var tempupi = 0, tempcash = 0, tempCheque = 0, tempdebit = 0, temptotalsellAmt = 0;
      item.forEach((itm) => {
        if (itm.paymentMode == "UPI") {
          itm.items.forEach((e) => {
            tempupi += e.price * e.qty
          })
          setsellupipayment(tempupi)
        }
        else if (itm.paymentMode == "Cash") {
          itm.items.forEach((c) => {
            tempcash += c.price * c.qty
          })
          setcash(tempcash)
        }
        else if (itm.paymentMode == "Cheque") {
          itm.items.forEach((a) => {
            tempCheque += a.price * a.qty
          })
          setCheque(tempCheque)
        }
        else if (itm.paymentType == 0) {
          itm.items.forEach((x) => {
            tempdebit += x.price * x.qty
          })
          setdebit(tempdebit)
        }
        else if (itm.paymentMode) {
          itm.items.forEach((i) => {
            temptotalsellAmt = i.price * i.qty
          })
          // settotalsellAmt(temptotalsellAmt)
        }
      })
    }
  }, [mutation])

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <div style={{ paddingTop: "10px" }}>
          <h5>Date Wise Quantity & Total Summary: {itemdate}</h5>
          <div className="col-12 col-md-6 m-2">
            <h6>Total of UPI : {Math.round(sellupipayment)}</h6>
          </div>
          <div className="col-12 col-md-6 m-2">
            <h6>Total of Cash : {Math.round(cash)}</h6>
          </div>
          <div className="col-12 col-md-6 m-2">
            <h6>Total of Cheque : {Math.round(Cheque)}</h6>
          </div>
          <div className="col-12 col-md-6 m-2">
            <h6>Total of Debit : {Math.round(debit)}</h6>
          </div>
          <p>--------------------------------</p>
          <div className="col-12 col-md-6 m-2">
            <h6>Total Sell Amount :{Math.round((+sellupipayment) + (+cash) + (+Cheque) + (+debit))}</h6>
          </div>
        </div>
        <GridToolbar />

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
                <h3>Sell Amount</h3>
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
                <h4 className="card-title">Date Wise Sell Amount</h4>
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
                      Toolbar:CustomToolbar
                    }}
                  />
                ) : (
                  <div className="d-flex justify-content-center align-item-center my-5">
                    <div> NO DATA AVAILABLE</div>
                  </div>
                )}
              </div>
            </div>
          </section>

        </div >
      </div >
    </>
  )
}