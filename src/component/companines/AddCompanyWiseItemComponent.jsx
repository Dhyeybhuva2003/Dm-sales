import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { ToastContainer } from 'react-toastify'
import { notifyDone } from "../../assets/toster"
import { useAdditemByCompany, useGetCompanys } from '../../services/companyAndItemServices'

export const AddCompanyWiseItemComponent = () => {

    const validation = {
        name: {
            required: {
                value: true,
                message: "Item name is required."
            },
            minLength: {
                value: 3,
                message: "minimum words length is 3."
            },
            maxLength: {
                value: 200,
                message: "maximum words length is 200."
            }
        },
        companyId: {
            required: {
                value: true,
                message: "Item name is required."
            },
        }
    }


    var navigate = useNavigate()
    var { data, isError, isLoading } = useGetCompanys()

    var { register, handleSubmit, formState: { errors } } = useForm();

    const submitData = (data) => {
        mutation.mutate(data)
    }

    const mutation = useAdditemByCompany();

    const [note, setnote] = useState(0)

    useEffect(() => {
        if (mutation.isError || isError) {
            navigate('/erorr404')
        }
        if (mutation.data && note === 0) {
            notifyDone("Company's item added successfully.")
            setnote(1)
        }
        if (mutation.isLoading) {
            setnote(0)
        }
    }, [mutation, data, isLoading])


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
                                    isLoading === true || data?.data?.data === undefined ? (
                                        <div className='d-flex justify-content-center align-item-center my-5'>
                                            <div class="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
                                                <span class="visually-hidden"></span>
                                            </div>
                                        </div>
                                    ) : (

                                        <form onSubmit={handleSubmit(submitData)} id='forms'>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <fieldset class="form-group mandatory">
                                                        <label htmlFor="designation" class="form-label">Select company</label>
                                                        <select class="form-select" id="designation" {...register("companyId", validation.companyId)}>
                                                            <option value="">Select company</option>
                                                            {
                                                                data?.data?.data?.map(company => {
                                                                    return (
                                                                        <option value={company._id}>{company.name}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                        <span className='text-danger font-weight-bold'>{errors?.companyId?.message}</span>
                                                    </fieldset>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mandatory">
                                                        <label htmlFor="item" class="form-label">Item name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="item"
                                                            placeholder="Enter item remarks"
                                                            {...register("name", validation.name)}
                                                        />
                                                        <span className='text-danger font-weight-bold'>{errors?.name?.message}</span>
                                                    </div>
                                                    <div class="d-flex form-group">
                                                        {
                                                            mutation.isLoading ? (
                                                                <button class="btn btn-primary mx-1" type="button" disabled="">
                                                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                    <span className='px-2'>Loading...</span>
                                                                </button>
                                                            ) : (
                                                                <button type="submit" class="btn btn-primary me-1 mb-1">Submit</button>
                                                            )
                                                        }
                                                        <button type="reset" class="btn btn-light-secondary me-1 mb-1" onClick={() => document.getElementById("forms").reset()}>Reset</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>

                                    )
                                }
                            </div >
                        </div >
                    </section >
                </div >
            </div >
        </>
    )
}
