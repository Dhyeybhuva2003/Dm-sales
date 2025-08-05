import React, { useEffect, useState } from "react";
import "../assets/css/main/app.css";
import "../assets/css/main/app-dark.css";
import "../assets/css/shared/iconly.css";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import {
  Chart,
  LineController,
  LinearScale,
  PointElement,
  LineElement,
  CategoryScale
} from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { useGetStockData } from "../services/stockServices";
import { addStock } from "../redux/StockSlice";
import { Autocomplete, Box, Button, Divider, Grid, SwipeableDrawer, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import getFinancialYearRange from "../utils/common";
import { setFYear } from "../redux/FinancialYearSlice";
import AddIcon from '@mui/icons-material/Add';

export const Deshboard = () => {
  var { data: stockData, isLoading: stockLoading } = useGetStockData();

  const stocksData = useSelector((state) => state.stock.value);
  const dispatch = useDispatch();
  const [LeftDrawer, setLeftDrawer] = useState(false);
  console.log("this is data : ",getFinancialYearRange());
  const [dropDownList,setDropDownList] = useState([getFinancialYearRange()]);
  const { fYear } = useSelector(state => state.fYear);
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
     fYear:fYear
    }
  });

  useEffect(() => {
    if (
      stockData !== undefined &&
      stockLoading === false &&
      stocksData.length === 0
    ) {
      dispatch(addStock(stockData.data.data));
    }
  }, [stockLoading]);

  function addPreviousFinancialYear(){
    const previousYear = dropDownList[0].split("-")[0];
    console.log("this is mine previous year : ",previousYear);
    setDropDownList((pres)=>(
     [ `${Number(previousYear)-1}-${previousYear}`,...pres]
    ))
  }

  Chart.register(
    LineController,
    LinearScale,
    PointElement,
    LineElement,
    CategoryScale
  );
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Sales",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1
      }
    ]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const submitFilterData =  (data) => {
    dispatch(setFYear(data.fYear));
    setLeftDrawer(false);
  }

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
          paddingTop={4}
          paddingLeft={3}
        >
        {/* select financial year drop down */}
        <Controller
            name="fYear"
            control={control}
            render={({ field, fieldState: { error } }) => {
            const { onChange, value, ref, onBlur } = field;
            return (
              <Autocomplete
              clearOnEscape={true}
              autoComplete
              autoHighlight
              clearOnBlur
              fullWidth={true}
              options={dropDownList}
              value={value} 
              onBlur={onBlur}
              onChange={(event,newValue) => {
                   onChange(newValue);
              }}
              // onInputChange={(event,newValue) => {
              //      onInputChange(newValue);
              // }}
              renderInput={(params) => (
                  <TextField
                  {...params} 
                  label={'Select Financial Year'}
                  inputRef={ref}
                  error={!!error}
                  InputProps={{ 
                      ...params.InputProps,
                      // endAdornment: (
                      // <React.Fragment>
                      //     {Loading ? (
                      //     <CircularProgress color="inherit" size={20} />
                      //     ) : null}
                      //     {params.InputProps.endAdornment}
                      // </React.Fragment>
                      // )
                  }}
              />
              )}
              readOnly={false}
              getOptionLabel={(option)=> option}
              /> 
              );
        }}></Controller>

        <button   
        className="btn btn-primary me-2 mb-2"
        onClick={addPreviousFinancialYear}
        style={{
          paddingTop: "5px",
          paddingBottom: "5px",
          outline: "none",
          width: "90%",
          margin: "1rem auto"
        }} size="small">Add Previous Financial Year</button>

          <button
            type="submit"
            className="btn btn-primary me-2 mb-2"
            style={{
              paddingTop: "5px",
              paddingBottom: "5px",
              outline: "none",
              width: "90%",
              margin: "1rem auto"
            }}
          >
            Submit
          </button>
        </Grid>
      </Box>
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
      <SwipeableDrawer
        anchor={"right"}
        open={LeftDrawer}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {<LeftSideDrawerList />}
      </SwipeableDrawer>

      <div id="app">
        <div id="main">
          <header className="mb-3">
            <a href="#" className="burger-btn d-block d-xl-none">
              <i className="bi bi-justify fs-3" />
            </a>
          </header>
          <div className="row">
            <div className="col-12 col-md-6 order-md-1 order-last">
              <h3>Company Statistics</h3>
            </div>
            <div className="col-12 col-md-6 order-md-2 order-first d-flex justify-content-end align-items-center">
              <button
                type="button"
                onClick={() => {
                  setValue("fYear", fYear);
                  setLeftDrawer(true);
                }}
                className="btn btn-primary me-2 mb-2"
                style={{
                  paddingTop: "5px",
                  paddingBottom: "5px",
                  outline: "none"
                }}
              >
                Filter
              </button>
            </div>
          </div>
          <div className="page-content">
            <section className="row">
              <div className="col-12 col-lg-9">
                <div className="row">
                  <div className="col-6 col-lg-3 col-md-6">
                    <div className="card">
                      <div className="card-body px-4 py-4-5">
                        <div className="row">
                          <div className="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start ">
                            <div className="stats-icon purple mb-2">
                              <i className="bi-check2-square" />
                            </div>
                          </div>
                          <div className="col-md-8 col-lg-12 col-xl-12 col-xxl-7">
                            <h6 className="text-muted font-semibold">
                              Total Sell Amount
                            </h6>
                            <h6 className="font-extrabold mb-0">112</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-lg-3 col-md-6">
                    <div className="card">
                      <div className="card-body px-4 py-4-5">
                        <div className="row">
                          <div className="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start ">
                            <div className="stats-icon blue mb-2">
                              <i className="iconly-boldProfile" />
                            </div>
                          </div>
                          <div className="col-md-8 col-lg-12 col-xl-12 col-xxl-7">
                            <h6 className="text-muted font-semibold">
                              Followers
                            </h6>
                            <h6 className="font-extrabold mb-0">183.000</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-lg-3 col-md-6">
                    <div className="card">
                      <div className="card-body px-4 py-4-5">
                        <div className="row">
                          <div className="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start ">
                            <div className="stats-icon blue mb-2">
                              <i className="iconly-boldProfile" />
                            </div>
                          </div>
                          <div className="col-md-8 col-lg-12 col-xl-12 col-xxl-7">
                            <h6 className="text-muted font-semibold">
                              Following
                            </h6>
                            <h6 className="font-extrabold mb-0">783.000</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-lg-3 col-md-6">
                    <div className="card">
                      <div className="card-body px-4 py-4-5">
                        <div className="row">
                          <div className="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start ">
                            <div className="stats-icon blue mb-2">
                              <i className="iconly-boldProfile" />
                            </div>
                          </div>
                          <div className="col-md-8 col-lg-12 col-xl-12 col-xxl-7">
                            <h6 className="text-muted font-semibold">Saved</h6>
                            <h6 className="font-extrabold mb-0">70</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-5 card pt-4 mx-3">
                    <div className="card-content pb-4">
                      <div className="name ms-4 mb-0">
                        <h5 className="mb-0 text-gray ">
                          Date Wise Debit Money List
                        </h5>
                      </div>
                      <div className="px-4">
                        <Link
                          to="/datewiseaddmoneylist"
                          className="btn btn-block btn-xl btn-outline-primary font-bold mt-3"
                        >
                          View Add MoneyList
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-6 card pt-4 mx-3">
                    <div className="card-content pb-4 pl-2">
                      <div className="name ms-4 mb-0">
                        <h5 className="mb-0 text-gray">
                          Month/Year Wise DebitMoney List
                        </h5>
                      </div>
                      <div className="px-4">
                        <Link
                          to="/mywiseaddmoneylist"
                          className="btn btn-block btn-xl btn-outline-primary font-bold mt-3"
                        >
                          Month/year wise List
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-6 card pt-4">
                    <div className="card-content pb-4 pl-2">
                      <div className="name ms-4 mb-0">
                        <h5 className="mb-0 text-gray">Filters</h5>
                      </div>
                      <div className="px-4">
                        <Link
                          to="/filter"
                          className="btn btn-block btn-xl btn-outline-primary font-bold mt-3"
                        >
                          Filters
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="card">
                        <div className="card-header">
                          <h4>Profit calculation</h4>
                        </div>
                        <div className="card-body">
                          <Line data={data} options={options} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-3">
                <div className="card">
                  <div className="card-body py-4 px-4">
                    <div className="ms-3 name">
                      <h5 className="font-bold">Admin</h5>
                      <h6 className="text-muted mb-0">@Patel Dhyeykumar</h6>
                    </div>
                  </div>
                </div>
                {/* -------------------------------------------------------- */}
                <div className="card pt-4">
                  <div className="card-content pb-4">
                    <div className="name ms-4 mb-0">
                      <h5 className="mb-1 text-danger">Credit Sell Bill</h5>
                    </div>
                    <div className="px-4">
                      <Link
                        to="/creditsellbill"
                        className="btn btn-block btn-xl btn-outline-primary font-bold mt-3"
                      >
                        View Credit Sell Bill
                      </Link>
                    </div>
                  </div>
                </div>
                {/* -------------------------------------------------------- */}
                <div className="card pt-4">
                  <div className="card-content pb-4">
                    <div className="name ms-4 mb-0">
                      <h5 className="mb-1 text-danger">Debit Sell Bill</h5>
                    </div>
                    <div className="px-4">
                      <Link
                        to="debitsellbill"
                        className="btn btn-block btn-xl btn-outline-primary font-bold mt-3"
                      >
                        View Debit Sell Bill
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <footer>
            <div className="footer">
              {/* <div className="float-start">
                                <p>2021 © Mazer</p>
                            </div> */}
              <div className="float-end">
                <p>
                  Developed by{" "}
                  <span className="text-danger">
                    <i className="bi bi-heart" />
                  </span>{" "}
                  <a href="https://alliedge.in">Alliedge technologies</a>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};
