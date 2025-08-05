import { useGetSellData } from "../../services/sellServices";
import React, { useEffect, useMemo, useState } from "react";
import { DataGrid, GridToolbarContainer, GridToolbar } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/css/style.css";
import { useDeleteSell } from "../../services/sellServices";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { retinaScale } from "chart.js/helpers";
import { setSellFEndDate, setSellFStartDate } from "../../redux/SellSlice";
import { useForm } from "react-hook-form";
import {
  Box,
  Grid,
  SwipeableDrawer,
  Typography
} from "@mui/material";
import Divider from "@mui/material/Divider";

const validation = {
  date: {
    required: {
      value: true,
      message: "Date is required.",
    },
  }
}


export const ViewSellBill = (props) => {
  var {
    data: sellData,
    isLoading: sellDataLoading,
    refetch
  } = useGetSellData();
  const mutation = useDeleteSell();
  const [LeftDrawer, setLeftDrawer] = useState(false);
  const dispatch = useDispatch();
  const { fStartDate,fEndDate } = useSelector(state => state.sell);
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    clearErrors,
    watch,
    setValue,
  } = useForm({
    defaultValues:{
      startDate:fStartDate,
      endDate:fEndDate,
    }
  });


  const submitFilterData = (filterData) => {
    dispatch(setSellFStartDate(filterData.startDate || ""));
    dispatch(setSellFEndDate(filterData.endDate || ""));
    setLeftDrawer(false);
    refetch();
  };

  const resetFilter = () => {
    console.log("this is reset the filter why not we are doing the refetch");
    dispatch(setSellFEndDate(""));
    dispatch(setSellFStartDate(""));
    refetch();
    setLeftDrawer(false);
    clearErrors();
  }

  const watchStartDate = watch("startDate");
  const watchEndDate = watch("endDate");

  const LeftSideDrawerList = () => {

    return (
      <Box
        component="form"
        onSubmit={handleSubmit(submitFilterData)}
        p={3}
        sx={{ width: 350 }}
      >
        <Typography
          variant="h5"
          style={{
            letterSpacing: "2px",
            marginBottom: "15px",
            color: "#25396f",
            fontWeight: 500
          }}
        >
          Filter
        </Typography>
        <Divider />
        <Grid
          container
          spacing={{ md: 3, xs: 2 }}
          justifyContent="space-between"
          alignItems="center"
        >
            <div className="form-group mandatory" style={{width:"80%",margin:"3rem auto 0 auto"}}>
              <label htmlFor="date" class="form-label">
                Start Date
              </label>
              <input
                type="date"
                className="form-control"
                id="date"
                max={watchEndDate}
                {...register("startDate")}
              />
              <span className="text-danger font-weight-bold">
                {errors?.startDate?.message}
              </span>
            </div>

            <div className="form-group mandatory" style={{width:"80%",margin:"1rem auto"}}>
              <label htmlFor="date" class="form-label">
                End Date
              </label>
              <input
                type="date"
                min={watchStartDate}
                className="form-control"
                id="endDate"
                {...register("endDate")}
              />
              <span className="text-danger font-weight-bold">
                {errors?.endDate?.message}
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary me-2 mb-2"
              style={{
                paddingTop: "5px",
                paddingBottom: "5px",
                outline: "none",
                width:"90%",
                margin:"1rem auto"
              }}
            >
              Save
            </button>
        <button
              type="button"
              className="btn btn-primary me-2 mb-2"
              onClick={resetFilter}
              style={{
                paddingTop: "5px",
                paddingBottom: "5px",
                outline: "none",
                width:"90%",
                margin:"1rem auto"
              }}
            >
              Reset
            </button>
        </Grid>

      </Box>
    );
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 15
    },
    { field: "_id", headerName: "", width: "0" },
    { field: "sellbillno", headerName: "Bill no", width: 90 },
    { field: "date", headerName: "Date", width: 100 },
    { field: "client", headerName: "Client", width: 340 },
    { field: "paymentType", headerName: "PaymType", width: 100 },
    { field: "total", headerName: "CurrentAmt", width: 115 },
    { field: "maintotal", headerName: "MainAmt", width: 110 },
    {
      field: "actions",
      headerName: "View Items",
      width: 150,
      renderCell: (params) => (
        <>
          <button
            type="button"
            className="btn btn-sm"
            data-bs-toggle="modal"
            data-bs-target={`#primary`}
            onClick={() => handleButtonClick1(params.row._id)}
          >
            <i class="bi bi-card-text text-primary"></i>
          </button>
          <button
            className="btn btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#primaryItems"
            onClick={() => handleButtonClick(params.row._id)}
          >
            <i class="bi bi-box-arrow-up"></i>
          </button>
          <Link
            className="btn btn-sm"
            to={`generate-sell-bill/${params.row._id}`}
            id={params.row._id}
          >
            <i class="bi bi-printer"></i>
          </Link>
          <button
            type="button"
            class="btn btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#danger1"
            onClick={() => deletesell(params.row._id)}
          >
            <i class="bi bi-trash3 text-danger"></i>
          </button>
        </>
      )
    }
  ];

  const [rowData, setRowData] = useState([]);
  var totalPrices = 0;
  var [sellbilltotal, setsellbilltotal] = useState(0);
  const setRows = (data) => {
    var id = 0;
    sellbilltotal = 0;
    setsellbilltotal(sellbilltotal);
    const completedData = data.map((element) => {
      sellbilltotal += element?.items
        ?.map((ele) => ele.qty * ele.price)
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0);
      setsellbilltotal(sellbilltotal);
      var date = element.date.substring(0, 10).split("-");
      date = `${date[2]}/${date[1]}/${date[0]}`;
      element?.items
        .map((ele) => ele.qty * ele.price)
        .forEach((ele) => (totalPrices += ele));
      return {
        id: ++id,
        _id: element._id,
        sellbillno: element.sellbillno,
        date: date,
        client: element?.clientId?.name,
        paymentType: element.paymentType === 1 ? "Credit" : "Debit",
        total: Math.round((element?.total * 100) / 100),
        maintotal: Math.round(
          element?.items
            ?.map((ele) => ele.qty * ele.price)
            .reduce((accumulator, currentValue) => {
              return accumulator + currentValue;
            }, 0)
        )
      };
    });
    setRowData(completedData);
  };

  var [others, setothers] = useState([]);
  var [totalPrice, settotalPrice] = useState(0);
  const handleButtonClick = (id) => {
    others = [];
    setothers(others);
    totalPrice = 0;
    settotalPrice(totalPrice);
    let calculation = 0;
    const dts = sellData?.data?.data?.filter((d) => d._id === id)[0].items;
    dts.forEach((itm) => {
      calculation += itm.price * itm.qty;
      settotalPrice(Math.round(calculation * 100) / 100);
      others.push(itm);
      setothers(others);
    });
  };

  var [selldeleteid, setselldeleteid] = useState("");
  var [remarks, setRemarks] = useState("");
  const deletesell = (id) => {
    setselldeleteid(id);
  };

  const deletesell1 = () => {
    mutation.mutate(selldeleteid);
  };

  const navigate = useNavigate();
  const [note, setNote] = useState(true);

  const chachedObject = useMemo(() => sellData?.data?.data)

  useEffect(() => {
    console.log("i am setting the data : ", sellData?.data?.data !== 0 && sellData?.data?.data !== undefined && sellDataLoading === false)
    if (
      sellData?.data?.data !== 0 &&
      sellData?.data?.data !== undefined &&
      sellDataLoading === false
    ) {
      props.onclose();
      props.sellItems(sellData?.data?.data);
      setRows(sellData?.data?.data);
    }
    if (mutation.isSuccess === true && note === true) {
      setNote(false);
      toast.success("sell deleted successfully");
      refetch();
    }
    if (mutation.isLoading && note === false) {
      setNote(true);
    }
    document.getElementsByName("_id").checked = "";
  }, [sellDataLoading,mutation.isSuccess,mutation.isLoading,chachedObject]);

  const handleButtonClick1 = (id) => {
    sellData?.data?.data
      ?.filter((e) => e._id === id)
      .map((f) => {
        setRemarks(f.remark);
      });
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbar />
        <h5 style={{ paddingTop: "12px" }}>
          Sell Bill List Total:{Math.round(sellbilltotal)}
        </h5>
      </GridToolbarContainer>
    );
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    clearErrors();
    setLeftDrawer(open);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <SwipeableDrawer
        anchor={"right"}
        open={LeftDrawer}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {<LeftSideDrawerList />}
      </SwipeableDrawer>

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
                <h3>Sell Bill List</h3>
              </div>
              <div className="col-12 col-md-6 order-md-2 order-first d-flex justify-content-end align-items-center">
                <button
                  type="button"
                  onClick={() => {setValue("startDate",fStartDate);setValue("endDate",fEndDate);setLeftDrawer(true);}}
                  className="btn btn-primary me-2 mb-2"
                  style={{
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    outline: "none"
                  }}
                >
                  Filter
                </button>
                <nav
                  aria-label="breadcrumb"
                  className="breadcrumb-header float-start float-lg-end"
                >
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Sell
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
          <section className="section">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Enter company wise items</h4>
              </div>
              <div className="card-body">
                {rowData.length != 0 ? (
                  <DataGrid
                    columns={columns}
                    rows={rowData}
                    components={{
                      Toolbar: CustomToolbar
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
                  <h5>Total Sell Bill Price : {Math.round(sellbilltotal)}</h5>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div
        class="modal fade text-left w-100"
        id="primaryItems"
        tabindex="-1"
        aria-labelledby="myModalLabel16"
        style={{ display: "none" }}
        aria-hidden="true"
      >
        <div
          class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl"
          role="document"
        >
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title" id="myModalLabel16">
                sell itemSlice
              </h4>
              <button
                type="button"
                class="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-x"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div className="card-content p-2">
                <div className="table-responsive">
                  <table className="table mb-0">
                    <thead className="thead-dark">
                      <tr>
                        <th>Company</th>
                        <th>Items</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {others?.map((itm) => {
                        return (
                          <>
                            <tr>
                              <td>{itm.companyId.name}</td>
                              <td>{itm?.itemId?.name}</td>
                              <td>{itm.qty}</td>
                              <td>{itm?.uom}</td>
                              <td>{itm.price}</td>
                              <td>{Math.round(itm.qty * itm.price)}</td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div className="text-left">
                Total sell price : {Math.round(totalPrice)}
              </div>
              <button
                type="button"
                class="btn btn-light-secondary"
                data-bs-dismiss="modal"
              >
                <i class="bx bx-x d-block d-sm-none"></i>
                <span class="d-none d-sm-block">Close</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ---------------------------------------------------------------- */}
      <div
        className="modal fade text-left"
        id={`primary`}
        // id="#primary"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="myModalLabel160"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header bg-primary">
              <h5 className="modal-title white" id="myModalLabel160">
                Other details
              </h5>
            </div>
            <div className="modal-body">
              <tr className="d-flex flex-column">
                <td>
                  <h6>Remark</h6>
                  <p>{remarks}</p>
                </td>
              </tr>
            </div>
            <div className="modal-footer">
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

      {/* ---------------------------------------------------------------- */}
      <div
        class="modal fade text-left"
        id="danger1"
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
            <div class="modal-header bg-danger">
              <h5 class="modal-title white" id="myModalLabel120">
                Danger alert
              </h5>
              <button
                type="button"
                class="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-x"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              Are you sure you want to delete this sell bill?
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-light-secondary"
                data-bs-dismiss="modal"
              >
                <i class="bx bx-x d-block d-sm-none"></i>
                <span class="d-none d-sm-block">Close</span>
              </button>
              <button
                class="btn btn-danger ml-1"
                data-bs-dismiss="modal"
                onClick={() => {
                  deletesell1();
                }}
              >
                <i class="bx bx-check d-block d-sm-none"></i>
                <span class="d-none d-sm-block">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
