import React, { useEffect, useState } from 'react'
import { useVendorData, useDeleteVendor, usevendorData } from '../../services/vendorServices'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { notifyDone, notifyErorr } from "../../assets/toster"
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridToolbarContainer, GridToolbar } from "@mui/x-data-grid";

export const ListVendorComponent = () => {

    const columns = [
        { field: "id",headerName: "ID",width: 30 },
        { field: "_id", headerName: "", width: "0" },
        { field: "name", headerName: "NAME", width: 200 },
        { field: "email", headerName: "EMAIL", width: 250 },
        { field: "phoneNumber", headerName: "PHONE NUMBER", width: 130 },
        { field: "gstNo", headerName: "GST NUMBER", width: 200 },
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
            data-bs-target={`#primary${params.row._id}`}>
                <i class="bi bi-card-text text-primary"></i>
            </button>
            <Link to={`editvendor/${params.row._id}`} className='btn btn-sm'>
                <i class="bi bi-box-arrow-up-right"></i>
            </Link>
            <button
                type="button"
                className="btn btn-sm"
                data-bs-toggle="modal"
                data-bs-target={`#danger${params.row._id}`}
            >
                <i class="bi bi-trash3 text-danger"></i>
            </button>
           </>
          ),
        },
      ];

    const mutation = useDeleteVendor();
    const { data: vendorData, isLoading: vendorLoading, refetch} = useVendorData();
    const [note, setnote] = useState(0)
    const [rowData, setRowData] = useState(0)
     var id=0;

    useEffect(() => {
        if (mutation.isSuccess && note === 0) {
            setnote(1)
            notifyErorr("vendor deleted successfully.")
            refetch()
        }

        if (mutation.isLoading === true && note === 1) {
            setnote(0)
        }
    }, [mutation, vendorData]);

    useEffect(() => {
        setRows();
      }, [vendorLoading])

    const setRows = () => {
        var id = 0; 
        const dataArray = [];
        if (vendorData?.data?.data?.length !== 0) {
          const completedData = vendorData?.data?.data?.map((element) => {
           return {
              id: ++id,
              _id: element._id,
              name: element.vendorName,
              email: element.email1,
              phoneNumber: element.phoneNumber1,
              gstNo: element.gstNo,
           }
            
          });
          if (completedData)
            setRowData(completedData);
        } else {
          navigate('/')
        }
      };

      const CustomToolbar = () => {
        return (
          <GridToolbarContainer>
            <GridToolbar />
          </GridToolbarContainer>
        );
      };

    const deleteVendor = (id) => {
        mutation.mutate(id);
    }

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
            <div id='main'>
                <header className="mb-3">
                    <a href="#" className="burger-btn d-block d-xl-none">
                        <i className="bi bi-justify fs-3" />
                    </a>
                </header>
                <div className="page-title">
                    <div className="row">
                        <div className="col-12 col-md-6 order-md-1 order-last">
                            <h3>Vendor</h3>
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
                                        Vendor
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
                                    <h4 className="card-title">Vendors </h4>
                                </div>
                                {
                                    mutation.isLoading === true || rowData === undefined || vendorLoading === true ? (
                                        <div className='d-flex justify-content-center align-item-center my-5'>
                                            <div class="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
                                                <span class="visually-hidden"></span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="card-content p-2">
                                            <div className="table-responsive">
                                            <DataGrid
                                                columnVisibilityModel={{
                                                status: false,
                                                _id: false,
                                                }}
                                                columns={columns}
                                                rows={rowData}
                                                components={{
                                                    Toolbar: CustomToolbar,
                                                }}
                                            />
                                            {
                                                vendorData?.data?.data?.map(vendor => {
                                                    return (
                                                        <>
                                                            <div
                                                                class="modal fade text-left"
                                                                id={`danger${vendor._id}`}
                                                                tabindex="-1"
                                                                aria-labelledby="myModalLabel120"
                                                                style={{ display: "none" }}
                                                                aria-hidden="true">
                                                                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                                                                    <div class="modal-content">
                                                                        <div class="modal-header bg-danger">
                                                                            <h5 class="modal-title white" id="myModalLabel120">Danger alert
                                                                            </h5>
                                                                            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                                            </button>
                                                                        </div>
                                                                        <div class="modal-body">
                                                                            Are you sure you want to delete this Vendor?
                                                                        </div>
                                                                        <div class="modal-footer">
                                                                            <button type="button" class="btn btn-light-secondary" data-bs-dismiss="modal">
                                                                                <i class="bx bx-x d-block d-sm-none"></i>
                                                                                <span class="d-none d-sm-block">Close</span>
                                                                            </button>
                                                                            <button
                                                                                class="btn btn-danger ml-1"
                                                                                data-bs-dismiss="modal"
                                                                                onClick={() => { deleteVendor(vendor._id) }}
                                                                            >
                                                                                <i class="bx bx-check d-block d-sm-none"></i>
                                                                                <span class="d-none d-sm-block">Delete</span>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="modal fade text-left"
                                                                id={`primary${vendor._id}`}
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
                                                                            <tr className='d-flex flex-column'>
                                                                                <td>
                                                                                    <h6>Second email</h6>
                                                                                    <p>{vendor?.email2 ? vendor?.email2 : "No second email"}</p>
                                                                                </td>
                                                                                <td>
                                                                                    <h6>Second contact number</h6>
                                                                                    <p>{vendor?.phoneNumber2 ? vendor?.phoneNumber2 : "No second phone number"}</p>
                                                                                </td>
                                                                                <td>
                                                                                    <h6>Remark</h6>
                                                                                    <p>{vendor?.remark}</p>
                                                                                </td>
                                                                                <td>
                                                                                    <h6>Address</h6>
                                                                                    <p>{vendor?.address}</p>
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
                                                        </>
                                                    )
                                                })
                                            }
                                                  
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </section >
            </div >
        </>
    )
}
