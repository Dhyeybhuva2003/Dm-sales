import React, { useEffect, useState } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { useDemoData } from '@mui/x-data-grid-generator';
import { Link } from 'react-router-dom';
import { useDeleteItem, useGetItems } from '../../services/companyAndItemServices';
import "../../assets/css/style.css"
import { notifyDone, notifyErorr } from './../../assets/toster';
import { ToastContainer } from 'react-toastify';

export const ListCompanyWiseItemComponent = () => {

    const columns = [
        { field: 'id', headerName: 'ID', width: 350 },
        { field: 'Company', headerName: 'Company', width: 300 },
        { field: 'Items', headerName: 'Items', width: 300 },
        {
            field: "actions",
            headerName: "Delete",
            width: 100,
            renderCell: (params) => (
                <>
                    <button type="button" class="btn btn-sm" data-bs-toggle="modal"
                        data-bs-target="#danger1"
                        onClick={() => deleteItems(params.row.id)}
                    >
                        <i class="bi bi-trash3 text-danger"></i>
                    </button>
                </>
            ),
        },
    ]
    var { data, isLoading, refetch } = useGetItems()

    const [rowData, setRowData] = useState([])

    const setRows = (data) => {
        const completedData = data.map(element => {
            return {
                "id": element._id,
                "Company": element.companyId?.name,
                "Items": element.name,
            }
        })
        setRowData(completedData)
    }

    const mutation = useDeleteItem();
    const deleteItems = (id) => {
        mutation.mutate(id);
    }

    var [note, setnote] = useState(false)
    useEffect(() => {
        if (data && isLoading === false) {
            setRows(data?.data?.data)
        }
        if (mutation.data && note === false) {
            notifyErorr("item Deleted successfully.")
            setnote(true)
            refetch()
        }
        if (mutation.isError && note === false) {
            notifyErorr("Error while delete items.")
            setnote(true)
        }
        if (mutation.isLoading && note === true) {
            setnote(false)
        }
    }, [isLoading, mutation])

    return (
        <div id="main">
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
            <header className="mb-3">
                <a href="#" className="burger-btn d-block d-xl-none">
                    <i className="bi bi-justify fs-3" />
                </a>
            </header>
            <div className="page-heading">
                <div className="page-title">
                    <div className="row">
                        <div className="col-12 col-md-6 order-md-1 order-last">
                            <h3>company's items</h3>
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
                            <h4 className="card-title">Enter company wise items</h4>
                        </div>
                        <div className="card-body">
                            {
                                rowData.length !== 0 && mutation.isLoading !== true ? (
                                    <DataGrid
                                        columns={columns}
                                        rows={rowData}
                                        slots={{ toolbar: GridToolbar }}
                                    />
                                ) : (
                                    <div className='d-flex justify-content-center align-item-center my-5'>
                                        <div class="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
                                            <span class="visually-hidden"></span>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
