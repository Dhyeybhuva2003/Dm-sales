import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import { notifyDone } from "../../assets/toster";
import { useVendorData } from "../../services/vendorServices";
import { useSelector } from "react-redux";
import { useAddPurchase, useGetItemCompanyWise, useGetUniqueBillNo } from "../../services/purchaseServices";
import { useGetCompanys, useGetItems } from "../../services/companyAndItemServices";

export const AddPurchaseComponent = () => {
  const validation = {
    uom: {
      required: {
        value: true,
        message: "This is required.",
      },
      minLength: {
        value: 1,
        message: "minimum words length is 1.",
      },
      maxLength: {
        value: 200,
        message: "maximum words length is 200.",
      },
    },
    gstper: {
      required: {
        value: true,
        message: "GST No is required.",
      }
    },
    companyId: {
      required: {
        value: true,
        message: "Company name is required.",
      },
    },
    vendorId: {
      required: {
        value: true,
        message: "Vendor name is required.",
      },
    },
    itemId: {
      required: {
        value: true,
        message: "Item name is required.",
      },
    },
    date: {
      required: {
        value: true,
        message: "Date is required.",
      },
    },
    qty: {
      required: {
        value: true,
        message: "Quantity is required.",
      },
      min: {
        value: 1,
        message: "Minimum one quantity is required.",
      },
      pattern: {
        value: /^[0-9]+$/,
        message: "Only numbers are allowed.",
      },
    },
    price: {
      required: {
        value: true,
        message: "Price is required.",
      }
    },
    invoice: {
      required: {
        value: true,
        message: "Invoice is required.",
      },
      minLength: {
        value: 1,
        message: "minimum words length is 1.",
      },
      maxLength: {
        value: 200,
        message: "maximum words length is 200.",
      },
    },
    remark: {
      required: {
        value: true,
        message: "Remarks is required.",
      },
      minLength: {
        value: 10,
        message: "minimum words length is 10.",
      },
      maxLength: {
        value: 3000,
        message: "maximum words length is 3000.",
      },
    },
  };

  var navigate = useNavigate();

  var {
    register: vendorRegister,
    handleSubmit: vendorSubmit,
    formState: { errors: vendorError },
  } = useForm();
  var {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  var [ids, setids] = useState(1);

  var [vendorDetails, setvendorDetails] = useState({});
  const submitBeforeData = (data) => {
    setvendorDetails(data);
  };

  var [purchaseItems, setPurchaseItems] = useState([]);
  const submitData = (data) => {
    data.id = ids;
    setids((ids += 1));
    setPurchaseItems([...purchaseItems, data]);
    notifyDone("Item added in list.");
    document.getElementById("forms").reset();
  };

  const { data: vendorData, isLoading: vendorLoading } = useVendorData();

  // var itemsData = useSelector((state) => state.items.value);
  // var companiesData = useSelector((state) => state.company.value);

  var {data:itemsData ,isLoading:itemDataLoading} = useGetItems();
  var { data: companiesData, isLoading: companiesDataLoading } = useGetCompanys();



  var [companyId, setcompanyId] = useState("");
  const getItemCompanyWise = (data) => {
    if (data !== "" && data !== null) {
      document.getElementById("items").disabled = false;
      setcompanyId(data);
    } else {
      document.getElementById("items").disabled = true;
    }
  };

  const deleteItems = (id) => {
    purchaseItems = purchaseItems.filter((item) => item.id !== id);
    setPurchaseItems(purchaseItems);
  };

  const setTotalRs = (gstper) => {
    var qty = document.getElementById("qty").value;
    var price = document.getElementById("price").value;
    if (qty <= 0) {
    }
    else if (gstper == 0) {
      var p = (price * qty);
      document.getElementById("totalPrice").value = p;
    }
    else {
      var p = (price * qty) + ((price * qty * gstper) / 100);
      document.getElementById("totalPrice").value = p;

    }
  };


  var billMutation = useGetUniqueBillNo();
  const getBillUnique = (value) => {
    if (value && value.length >= 2) {
      billMutation.mutate(value);
    }
  }

  const mutation = useAddPurchase();
  const addDataIntoPurchase = () => {
    vendorDetails.items = purchaseItems;
    setvendorDetails(vendorDetails);
    mutation.mutate(vendorDetails);
  };

  var [billError, setbillError] = useState(true)
  var [note, setnote] = useState(0);
  useEffect(() => {
    if (mutation.isSuccess) {
      notifyDone("Purchase items added successfully.");
      navigate("/");
    } else if (mutation.isError) {
      navigate("/erorr404");
    }
    if (mutation.data && note === 0) {
      notifyDone("Company's item added successfully.");
      setnote(1);
    }
    if (mutation.isLoading) {
      setnote(0);
    }
    if (itemsData?.data?.data?.length === 0 && companiesData?.data?.data?.length === 0) {
      navigate("/");
    }
    if (billMutation.data) {
      if (billMutation.data.data.data === false) {
        setbillError(false)
      } else {
        setbillError(true)
      }
    }
  }, [itemsData, companiesData, companyId, mutation, billMutation]);

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
                <h3>Purchase</h3>
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
            <div
              className="card"
              style={{
                display: `${Object.keys(vendorDetails).length === 0 ? "block" : "none"
                  }`,
              }}
            >
              <div className="card-header">
                <h4 className="card-title">Vendor and other info </h4>
              </div>
              <div className="card-body">
                <form onSubmit={vendorSubmit(submitBeforeData)}>
                  <div className="row">
                    <div className="col-md-6">
                      <fieldset class="form-group mandatory">
                        <label htmlFor="vendor" class="form-label">
                          Select Vendor
                        </label>
                        <select
                          class="form-select"
                          id="vendor"
                          {...vendorRegister("vendorId", validation.vendorId)}
                        // onChange={(event) => desebleVendor(event.target.value)}
                        >
                          <option value="">Select Vendor's name</option>
                          {vendorData?.data?.data?.map((vendor) => {
                            return (
                              <option value={vendor._id}>
                                {vendor.vendorName}
                              </option>
                            );
                          })}
                        </select>
                        <span className="text-danger font-weight-bold">
                          {vendorError?.vendorId?.message}
                        </span>
                      </fieldset>
                      <div className="form-group mandatory">
                        <label htmlFor="date" class="form-label">
                          Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="date"
                          {...vendorRegister("date", validation.date)}
                        />
                        <span className="text-danger font-weight-bold">
                          {vendorError?.date?.message}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mandatory">
                        <div className="d-flex justify-content-between">
                          <label htmlFor="invoice" class="form-label">
                            Invoice (Bill number)
                          </label>
                          <span className="text-danger font-weight-bold mx-2" style={{ display: billError == true ? "none" : "block" }}>
                            <b>  Please, enter unique bill number</b>
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          id="invoice"
                          placeholder="Enter your invoice or bill number"
                          onKeyUp={(event) => getBillUnique(event.target.value)}
                          {...vendorRegister("invoice", validation.invoice)}
                        />
                        <span className="text-danger font-weight-bold">
                          {vendorError?.invoice?.message}
                        </span>
                      </div>
                      <div className="form-group mandatory">
                        <div class="form-group mb-3">
                          <label for="remarks" class="form-label">
                            Remarks
                          </label>
                          <textarea
                            class="form-control"
                            maxLength="3000"
                            id="remarks"
                            rows="2"
                            {...vendorRegister("remark", validation.remark)}
                            placeholder="Enter Remark"
                          ></textarea>
                        </div>
                        <span className="text-danger font-weight-bold">
                          {vendorError?.remark?.message}
                        </span>
                      </div>
                      <button
                        type="submit"
                        class="btn btn-outline-primary me-1 mb-1"
                        disabled={billError !== true ? true : false}
                      >
                        Process next
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div
              className="card fadeUp"
              style={{
                display: `${Object.keys(vendorDetails).length !== 0 ? "block" : "none"
                  }`,
              }}
            >
              <div className="card-header">
                <h4 className="card-title">Genetate purchase items</h4>
              </div>
              <div className="card-body">
                {vendorLoading === true ||
                  vendorData?.data?.data === undefined ? (
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
                  <form onSubmit={handleSubmit(submitData)} id="forms">
                    <div className="d-flex justify-content-evenly">
                      <p>
                        Vendor name :
                        {
                          vendorData?.data?.data?.find(
                            (vendor) => vendor._id === vendorDetails.vendorId
                          )?.vendorName
                        }{" "}
                      </p>
                      <p>Bill (Invoice) Number : {vendorDetails?.invoice} </p>
                      <p>Date : {vendorDetails?.date} </p>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <fieldset class="form-group mandatory">
                          <label htmlFor="company" class="form-label">
                            Select company
                          </label>
                          <select
                            class="form-select"
                            id="company"
                            {...register("companyId", validation.companyId)}
                            onChange={(event) => {
                              getItemCompanyWise(event.target.value);
                            }}
                          >
                            <option value="">Select company</option>
                            {companiesData?.data?.data?.map((company) => {
                              return (
                                <option value={company._id}>
                                  {company.name}
                                </option>
                              );
                            })}
                          </select>
                          <span className="text-danger font-weight-bold">
                            {errors?.companyId?.message}
                          </span>
                        </fieldset>
                        <div className="form-group mandatory">
                          <label htmlFor="item" class="form-label">
                            Quantity
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="qty"
                            placeholder="Enter quantity."
                            {...register("qty", validation.qty)}
                          />
                          <span className="text-danger font-weight-bold">
                            {errors?.qty?.message}
                          </span>
                        </div>
                        <div className="form-group mandatory">
                          <label htmlFor="item" class="form-label">
                            Price of one unit
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="price"
                            placeholder="Enter quantity."

                            {...register("price", validation.price)}
                          />
                          <span className="text-danger font-weight-bold">
                            {errors?.price?.message}
                          </span>
                        </div>
                        <div className="form-group mandatory">
                          <label htmlFor="totalPrice" class="form-label">
                            Total price
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="totalPrice"
                            disabled="true"
                          // {...register("totalprice", { value: totalPrice })}
                          />
                          <span className="text-danger font-weight-bold">
                            {errors?.totalPrice?.message}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <fieldset class="form-group mandatory">
                          <label htmlFor="items" class="form-label">
                            Select item
                          </label>
                          <select
                            class="form-select"
                            id="items"
                            {...register("itemId", validation.itemId)}
                            disabled="true"
                          >
                            <option value="">First select company</option>
                            {itemsData?.data?.data?.map((item) => {
                              if (item?.companyId?._id == companyId) {
                                return (
                                  <option key={item._id} value={item._id}>
                                    {item.name}
                                  </option>
                                );
                              }
                            })}
                          </select>
                          <span className="text-danger font-weight-bold">
                            {errors?.itemId?.message}
                          </span>
                        </fieldset>
                        <div className="form-group mandatory">
                          <label htmlFor="uom" class="form-label">
                            Unit of mesurement
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="uom"
                            placeholder="example: KG, Nos."
                            {...register("uom", validation.uom)}
                          />
                          <span className="text-danger font-weight-bold">
                            {errors?.uom?.message}
                          </span>
                        </div>
                        <div className="form-group mandatory">
                          <label htmlFor="item" class="form-label">
                            Select GST
                          </label>
                          <select
                            class="form-select"
                            id="gstper"
                            onChangeCapture={(event) =>
                              setTotalRs(event.target.value)
                            }
                            // onVolumeChange={changeGstValue}
                            {...register("gstper", validation.gstper)}
                          >

                            <option >Select GST Per</option>
                            <option value={0}>0%</option>
                            <option value={5}>5%</option>
                            <option value={12}>12%</option>
                            <option value={18}>18%</option>
                            <option value={28}>28%</option>
                          </select>
                          <span className="text-danger font-weight-bold">
                            {errors?.gstper?.message}
                          </span>
                        </div>
                        <div class="d-flex justify-content-between form-group mt-5">
                          <div className="">
                            <button
                              type="submit"
                              class="btn btn-outline-primary me-1 mb-1"
                            >
                              Submit
                            </button>
                          </div>
                          <div className="">
                            {mutation.isLoading ? (
                              <button
                                class="btn btn-primary mx-1"
                                type="button"
                                disabled=""
                              >
                                <span
                                  class="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                <span className="px-2">Loading...</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                class="btn btn-primary me-1 mb-1"
                                data-bs-toggle="modal"
                                data-bs-target={`#process-to-purchase`}
                                disabled={
                                  purchaseItems.length === 0 ? true : false
                                }
                              >
                                Process to purchase
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
            <div
              className="card"
              style={{
                display: `${Object.keys(vendorDetails).length !== 0 ? "block" : "none"
                  }`,
              }}
            >
              <div className="card-header">
                <h4 className="card-title">Purchase Items </h4>
              </div>
              {purchaseItems.length === 0 ? (
                <div className="d-flex justify-content-center align-item-center my-5">
                  No items added
                </div>
              ) : (
                <div className="card-content p-2">
                  <div className="table-responsive">
                    <div className="d-flex justify-content-evenly"></div>
                    <table className="table mb-0">
                      <thead className="thead-dark">
                        <tr>
                          <th>Company</th>
                          <th>Item</th>
                          <th>Quantity</th>
                          <th>Uom</th>
                          <th>Price</th>
                          <th>GST</th>
                          <th>Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseItems?.map((item) => {
                          return (
                            <>
                              <tr>
                                <td className="text-bold-500">
                                  {
                                    companiesData?.data?.data?.find(
                                      (ele) => ele._id === item.companyId
                                    )?.name
                                  }
                                </td>
                                <td>
                                  {
                                    itemsData?.data?.data?.find(
                                      (itm) => itm._id === item.itemId
                                    )?.name
                                  }
                                </td>
                                <td className="text-bold-500">{item.qty}</td>
                                <td>{item.uom}</td>
                                <td>{item.price}</td>
                                <td>{item.gstper}%</td>
                                <td>{item.gstper == "0" ? Math.round((item.price * item.qty)) : Math.round((item.price * item.qty) + ((item.price * item.qty * item.gstper) / 100))}</td>
                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-sm"
                                    data-bs-toggle="modal"
                                    data-bs-target={`#danger${item.id}`}
                                  >
                                    <i class="bi bi-trash3 text-danger"></i>
                                  </button>
                                </td>
                              </tr>
                              <div
                                class="modal fade text-left"
                                id={`danger${item.id}`}
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
                                          deleteItems(item.id);
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
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div
              class="modal fade text-left"
              id={`process-to-purchase`}
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
                  <div class="modal-header bg-primary">
                    <h5 class="modal-title white" id="myModalLabel120">
                      Process alert
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
                    Are you sure you want to process to purchase?
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
                      class="btn btn-primary ml-1"
                      data-bs-dismiss="modal"
                      onClick={addDataIntoPurchase}
                    >
                      <i class="bx bx-check d-block d-sm-none"></i>
                      <span class="d-none d-sm-block">Process</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section >
        </div >
      </div >
    </>
  );
};
