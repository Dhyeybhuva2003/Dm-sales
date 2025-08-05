import { React, useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { DataGrid, GridToolbarContainer, GridToolbar } from "@mui/x-data-grid";
import { useMYWiseAddMoney } from '../../services/sellServices';
export const MYWiseAddMoneyList = () => {


  const validation = {
    date1: {
      required: {
        value: true,
        message: "Date1 is required.",
      },
    },
    date2: {
      required: {
        value: true,
        message: "Date2 is required.",
      }
    }
  }
  var id = 0;
  var [groupedSum, setgroupedSum] = useState(0)
  var [datewisesum, setdatewisesum] = useState(0)
  var { register, handleSubmit, formState: { errors } } = useForm();
  const mutation = useMYWiseAddMoney();


  const submitData = (data) => {
    mutation.mutate(data)
  }


  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
    },
    { field: "_id", headerName: "", width: "0" },
    { field: "date", headerName: "Date", width: 150 },
    { field: "datewiseSum", headerName: "Debit Money", width: 120 },
    { field: "groupedSum", headerName: "Credit Money", width: 220 }
  ];


  const [rowData, setRowData] = useState([]);
  var [totals, settotals] = useState(0)
  var array = [], a = 0, amount;

  const setRows = (data) => {
    array.push(data)
    console.log("array", array[0]);

    //--------------------------------------------------------------------------
    const dateSumMap = array[0].data?.reduce((map, entry) => {
      const date = entry.date;
      if (!map[date]) {
        map[date] = 0;
      }
      map[date] += entry.amount;
      return map;
    }, {});
    const groupedData = Object.keys(dateSumMap).map(date => ({
      date,
      sum: dateSumMap[date]
    }));

    setgroupedSum(groupedData.reduce((total, group) => total + group.sum, 0))

    //--------------------------------------------------------------------------
    const dateWiseSums = {};
    array[0]?.sells?.forEach((s) => {
      const date = s.date;
      s?.items?.forEach((itm) => {
        const product = itm.qty * itm.price;
        if (!dateWiseSums[date]) {
          dateWiseSums[date] = { amount: 0 }; // Initialize the object with amount property
        }
        dateWiseSums[date].amount += product;
      });
    });
    setdatewisesum(Object.values(dateWiseSums).reduce((total, entry) => total + entry.amount, 0))
    //--------------------------------------------------------------------------
    const combinedData = [];
    let id = 0; // Initialize the id

    groupedData.forEach((group) => {
      const date = group.date;
      const datewiseSum = dateWiseSums[date] ? dateWiseSums[date].amount : 0;
      const groupedSum = group.sum || 0; // Use 0 if groupedSum is not available

      combinedData.push({
        id: ++id, // Increment the id
        date: date,
        datewiseSum: datewiseSum,
        groupedSum: groupedSum,
      });
    });


    // Loop through the dateWiseSums to find dates without groupedSum
    Object.keys(dateWiseSums).forEach((date) => {
      if (!groupedData.find((group) => group.date === date)) {
        const datewiseSum = dateWiseSums[date].amount;

        combinedData.push({
          id: ++id, // Increment the id
          date: date,
          groupedSum: 0,
          datewiseSum: datewiseSum,
        });
      }
    });
    combinedData.sort((a, b) => a.date.localeCompare(b.date));

    combinedData.sort((a, b) => a.date.localeCompare(b.date));

    console.log("Combined Data:", combinedData);
    setRowData(combinedData);

  }
  useEffect(() => {
    if (mutation.data && mutation.isLoading === false) {
      console.log("mutation Data", mutation.data.data.data);
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
        <h5 style={{ paddingTop: "12px" }}>Debit Money Total : {datewisesum}</h5>
        <h5 style={{ paddingTop: "12px" }}> | Add Money Total : {groupedSum}</h5>
        <h5 style={{ paddingTop: "12px" }}> | Diff : { datewisesum - groupedSum}</h5>
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
                      <Link to="/">Deshbooard</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Month/year wise report
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
                        Date1
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="date"
                        {...register("date1", validation.date1)}
                      />
                      <span className="text-danger font-weight-bold">
                        {errors?.date1?.message}
                      </span>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="date2" class="form-label">
                        Date2
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="date"
                        {...register("date2", validation.date2)}
                      />
                      <span className="text-danger font-weight-bold">
                        {errors?.date2?.message}
                      </span>
                    </div>
                    {/* <div className="col-md-6 pt-1"> */}
                    <div className="col-md-12 pt-1 d-flex justify-content-center">
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
                <h4 className="card-title">List For Between Two Dates</h4>
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
              </div>
            </div>
          </section></div >
      </div >
    </>
  )
}
