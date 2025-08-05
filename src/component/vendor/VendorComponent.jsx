import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { usePostvendorData } from '../../services/vendorServices';
import { ToastContainer } from 'react-toastify';
import { notifyDone } from "../../assets/toster"
export const VendorComponent = () => {


    const validation = {
        vendorName: {
            required: {
                value: true,
                message: "Client name is required."
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
        email1: {
            required: {
                value: true,
                message: "Email is required."
            },
            minLength: {
                value: 3,
                message: "minimum words length is 3."
            },
            maxLength: {
                value: 200,
                message: "maximum words length is 60."
            }
        },
        email2: {
            minLength: {
                value: 3,
                message: "minimum words length is 3."
            },
            maxLength: {
                value: 200,
                message: "maximum words length is 60."
            }
        },
        gstNo: {
            required: {
                value: true,
                message: "GST number is required."
            },
            minLength: {
                value: 8,
                message: "minimum words length is 8."
            },
            maxLength: {
                value: 30,
                message: "maximum words length is 30."
            }
        },
        phoneNumber1: {
            required: {
                value: true,
                message: "Phone number is required."
            },
            minLength: {
                value: 3,
                message: "minimum words length is 8."
            },
            maxLength: {
                value: 12,
                message: "maximum words length is 12."
            }
        },
        phoneNumber2: {
            minLength: {
                value: 8,
                message: "minimum words length is 8."
            },
            maxLength: {
                value: 12,
                message: "maximum words length is 12."
            }
        },
        remark: {
            required: {
                value: true,
                message: "Remarks is required."
            },
            minLength: {
                value: 10,
                message: "minimum words length is 10."
            },
            maxLength: {
                value: 3000,
                message: "maximum words length is 3000."
            }
        },
        address: {
            required: {
                value: true,
                message: "Address is required."
            },
            minLength: {
                value: 10,
                message: "minimum words length is 10."
            },
            maxLength: {
                value: 3000,
                message: "maximum words length is 3000."
            }
        }
    }

    var navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm()

    const submitData = (data) => {
        mutation.mutate(data)
        var vendor = {
            vendorName: data.vendorName,
            gstNo: data.gstNo,
            phoneNumber1: data.phoneNumber1,
            phoneNumber2: data.phoneNumber2,
            email1: data.email1,
            email2: data.email2,
            remark: data.remark,
            address: data.address,
        }

    }
    const mutation = usePostvendorData();
    var [note, setnote] = useState(0)
    useEffect(() => {
        if (mutation.isError) {
            navigate('/erorr404')
        }
        if (mutation.data && note === 0) {
            notifyDone("vendor added successfully.")
            setnote(1)
        }
        if (mutation.isLoading) {
            setnote(0)
        }
    }, [mutation])
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
                                <h3>Vendor</h3>
                            </div>
                            <div className="col-12 col-md-6 order-md-2 order-first">
                                <nav
                                    aria-label="breadcrumb"
                                    className="breadcrumb-header float-start float-lg-end">
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
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Enter Vendor details</h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit(submitData)} id='forms'>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div class="form-group mandatory">
                                                <label for="first-name-column" class="form-label">Vendor Name</label>
                                                <input type="text"
                                                    id="first-name-column"
                                                    class="form-control"
                                                    placeholder="Enter Vendor name"
                                                    name="fname-column"
                                                    data-parsley-required="true"
                                                    {...register("vendorName", validation.vendorName)}

                                                />
                                                <span className='text-danger font-weight-bold'>{errors?.vendorName?.message}</span>
                                            </div>

                                            <div className="form-group mandatory">
                                                <label htmlFor="phoneNo" class="form-label">Phone Number</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="phoneNo"
                                                    placeholder="Enter contact number"
                                                    data-parsley-required="true"
                                                    {...register("phoneNumber1", validation.phoneNumber1)}
                                                />
                                                <span className='text-danger font-weight-bold'>{errors?.phoneNumber1?.message}</span>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="phoneNumberSecond" class="form-label">Phone Number</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="phoneNumberSecond"
                                                    placeholder="Enter second phone number"
                                                    {...register("phoneNumber2", validation.phoneNumber2)}
                                                />
                                                <span className='text-danger font-weight-bold'>{errors?.phoneNumber2?.message}</span>
                                            </div>
                                            <div className="form-group mandatory">
                                                <label htmlFor="gst" class="form-label">Address</label>
                                                <textarea class="form-control" maxLength="3000" placeholder='Enter Address' id="remarks" rows="2"{...register("address", validation.address)}></textarea>
                                                <span className='text-danger font-weight-bold'>{errors?.address?.message}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mandatory">
                                                <label htmlFor="email" class="form-label">Email</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="email"
                                                    placeholder="Enter email address"
                                                    {...register("email1", validation.email1)}
                                                />
                                                <span className='text-danger font-weight-bold'>{errors?.email1?.message}</span>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email" class="form-label">Email</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="email"
                                                    placeholder="Enter second email address"
                                                    {...register("email2", validation.email2)}
                                                />
                                                <span className='text-danger font-weight-bold'>{errors?.email2?.message}</span>
                                            </div>
                                            <div className="form-group mandatory">
                                                <label htmlFor="panno" class="form-label">GST Number</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="panno"
                                                    placeholder="Enter GST Number"
                                                    data-parsley-required="true"
                                                    {...register("gstNo", validation.gstNo)}
                                                />
                                                <span className='text-danger font-weight-bold'>{errors?.gstNo?.message}</span>
                                            </div>
                                            <div className="form-group mandatory">
                                                <div class="form-group mb-3">
                                                    <label for="remarks" class="form-label">Remarks</label>
                                                    <textarea class="form-control" maxLength="3000" id="remarks" rows="2"  {...register("remark", validation.remark)} placeholder='Enter Remark'></textarea>
                                                </div>
                                                <span className='text-danger font-weight-bold'>{errors?.remark?.message}</span>
                                            </div>

                                            <div class="d-flex form-group">
                                                <button type="submit" class="btn btn-primary me-2 mb-1">Submit</button>
                                                <button type="reset" class="btn btn-light-secondary me-1 mb-1" onClick={() => document.getElementById("forms").reset()} >Reset</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                </div >
            </div >
        </>
    )
}
