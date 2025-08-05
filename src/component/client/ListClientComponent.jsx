import React, { useEffect, useState } from "react";
import { useClientData, useDeleteClient } from "../../services/clientServices";
import { Link } from "react-router-dom";
import { notifyErorr } from "../../assets/toster";
import { ToastContainer } from "react-toastify";
import { DataGrid, GridToolbarContainer, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { deleteClients } from "../../redux/ClientSlice";

export const ListClientComponent = () => {

  const columns = [
    { field: "id",headerName: "ID",width: 10 },
    { field: "_id", headerName: "", width: "0" },
    { field: "name", headerName: "NAME", width: 320 },
    // { field: "email", headerName: "EMAIL", width: 150 },
    { field: "phoneNumber", headerName: "PHONE NUMBER", width: 120 },
    { field: "address", headerName: "Address", width: 270 },
    {
      field: "actions",
      headerName: "View Items",
      width: 100,
      renderCell: (params) => (
        <>
          <Link
            to={`editclient/${params.row._id}`}
            className="btn btn-sm">
              <i class="bi bi-box-arrow-up-right"></i>
          </Link>
          <button
            type="button"
            className="btn btn-sm"
            data-bs-toggle="modal"
            data-bs-target={`#danger${params.row._id}`}
          >
            <i class="bi bi-box-arrow-up"></i>
          </button>
        </>
      ),
    },
  ];

  const handleFilterChange = (filterModal) => {
    console.log("this filter change : ",filterModal);
  }

  const mutation = useDeleteClient();
  const { data: clientData, isLoading: clientLoading, refetch } = useClientData();
  var id=0;
  const [note, setnote] = useState(0);
  var [rowData, setRowData] = useState([]);

  useEffect(() => {
    if (mutation.isSuccess && note === 0) {
      refetch();
      setnote(1)
    }

    if (mutation.isLoading === true && note === 1) {
      setnote(0)
    }
  }, [mutation.data, mutation.isLoading, clientData]);

  const setRows = () => {
    var id = 0; 
    const dataArray = [];
    if (clientData?.data?.data?.length !== 0) {
      const completedData = clientData?.data?.data?.map((element) => {
       return {
          id: ++id,
          _id: element._id,
          name: element.name,
          email: element.email,
          phoneNumber: element.phoneNumber,
          address: element.address,
       }
        
      });
      if (completedData)
        setRowData(completedData);
    } else {
      navigate('/')
    }
  };

  useEffect(() => {
    setRows();
  }, [clientLoading])

  const deleteClient = (id) => {
    mutation.mutate(id);
    notifyErorr("Client deleted successfully.");
  };

  
  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbar />
      </GridToolbarContainer>
    );
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div id="main">
        <header className="mb-3">
          <a href="#" className="burger-btn d-block d-xl-none">
            <i className="bi bi-justify fs-3" />
          </a>
        </header>
        <div className="page-title">
          <div className="row">
            <div className="col-12 col-md-6 order-md-1 order-last">
              <h3>Client</h3>
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
                    Client
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
        <section className="section">
          <div className="row" id="table-head">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Clients </h4>
                </div>
                {clientLoading === 0 ||
                  mutation.isLoading === true || clientData?.data?.data === undefined || clientData === true ? (
                  <div className="d-flex justify-content-center align-item-center my-5">
                    <div
                      class="spinner-border"
                      style={{ width: "3rem", height: "3rem" }}
                      role="status"
                    >
                      <span class="visually-hidden"></span>
                    </div>
                  </div>
                ) : (
                  <div className="card-body">
                {rowData.length !== 0 && clientData?.data?.data?.length != 0 ? (
                  <DataGrid
                    columnVisibilityModel={{
                      status: false,
                      _id: false,
                    }}
                  
                    onFilterModelChange={handleFilterChange}
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
                  </div>
                )}
                {
                 clientData && clientData.data.data.map((client) => (
                    <div
                    class="modal fade text-left"
                    id={`danger${client._id}`}
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
                          <h5
                            class="modal-title white"
                            id="myModalLabel120"
                          >
                            Danger alert
                          </h5>
                          <button
                            type="button"
                            class="close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
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
                              <line
                                x1="18"
                                y1="6"
                                x2="6"
                                y2="18"
                              ></line>
                              <line
                                x1="6"
                                y1="6"
                                x2="18"
                                y2="18"
                              ></line>
                            </svg>
                          </button>
                        </div>
                        <div class="modal-body">
                          Are you sure you want to delete this
                          client?
                        </div>
                        <div class="modal-footer">
                          <button
                            type="button"
                            class="btn btn-light-secondary"
                            data-bs-dismiss="modal"
                          >
                            <i class="bx bx-x d-block d-sm-none"></i>
                            <span class="d-none d-sm-block">
                              Close
                            </span>
                          </button>
                          <button
                            class="btn btn-danger ml-1"
                            data-bs-dismiss="modal"
                            onClick={() => {
                              deleteClient(client._id);
                            }}
                          >
                            <i class="bx bx-check d-block d-sm-none"></i>
                            <span class="d-none d-sm-block">
                              Delete
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  ))
                }
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
