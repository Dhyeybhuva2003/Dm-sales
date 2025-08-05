import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEditClient } from '../../services/clientServices';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { notifyDone } from '../../assets/toster';

export const EditClient = () => {

    const validation = {
        name: {
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
        phoneNumber: {
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

    const mutation = useEditClient();

    var id = useParams().clientId;
    var { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: async () => {
            const client = await axios.get("http://localhost:9990/distributer/api/v1/public/client/client/" + id)
            return {
                name: client?.data?.data.name,
                panNumber: client?.data?.data.panNumber,
                phoneNumber: client?.data?.data.phoneNumber,
                phoneNumber2: client?.data?.data.phoneNumber2,
                email: client?.data?.data.email,
                email2: client?.data?.data.email2,
                GSTNo: client?.data?.data.GSTNo,
                address: client?.data?.data.address
            }
        }
    });

    const submitData = (data) => {
        mutation.mutate({ id: id, data: data });
    }
    const navigate = useNavigate();
    useEffect(() => {
        if (mutation.isError) {
            navigate('/erorr404')
        }
        if (mutation.data) {
            notifyDone("Client added successfully.")
            navigate("/clientlist")
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
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Enter Clients details</h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit(submitData)} id='forms'>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div class="form-group mandatory">
                                                <label for="first-name-column" class="form-label">Client Name</label>
                                                <input type="text"
                                                    id="first-name-column"
                                                    class="form-control"
                                                    placeholder="Enter client name"
                                                    name="fname-column"
                                                    // disabled
                                                    data-parsley-required="true"
                                                    {...register("name", validation.name)} />
                                                <span className='text-danger font-weight-bold'>{errors?.name?.message}</span>
                                            </div>
                                            <div className="form-group mandatory">
                                                <label htmlFor="phoneNo" class="form-label">Phone Number</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="phoneNo"
                                                    placeholder="Enter contact number"
                                                    data-parsley-required="true"
                                                    {...register("phoneNumber", validation.phoneNumber)}
                                                />
                                                <span className='text-danger font-weight-bold'>{errors?.phoneNumber?.message}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="email" class="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    placeholder="Enter email address"
                                                    {...register("email")}
                                                />
                                            </div>
                                            <div className="form-group mandatory">
                                                <div class="form-group mb-3">
                                                    <label for="address" class="form-label">Address</label>
                                                    <textarea
                                                        class="form-control"
                                                        maxLength="3000"
                                                        id="address"
                                                        rows="2"
                                                        {...register("address", validation.address)}
                                                    ></textarea>
                                                    <span className='text-danger font-weight-bold'>{errors?.address?.message}</span>
                                                </div>
                                            </div>
                                            <div class="d-flex form-group">
                                                {
                                                    mutation.isLoading ? (
                                                        <button class="btn btn-primary" type="button" disabled="">
                                                            <span class="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true"></span>
                                                            Loading...
                                                        </button>
                                                    ) : (
                                                        <button type="submit" class="btn btn-primary mx-1 mb-1">Submit</button>
                                                    )
                                                }
                                                <button type="reset" class="btn btn-light-secondary mx-1 mb-1" onClick={() => document.getElementById("forms").reset()}>Reset</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section >
                </div >
            </div >
        </>
    )
}
