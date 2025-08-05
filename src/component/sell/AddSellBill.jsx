import { React, useState, useEffect, useDeferredValue } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useClientData } from '../../services/clientServices';
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import { notifyDone } from "../../assets/toster";
import { useDispatch, useSelector } from "react-redux";
import { useAddSell, useGetUniqueBillNo } from "../../services/sellServices";
import { useGetStockData } from '../../services/stockServices';
import { addStock } from '../../redux/StockSlice';
import { useGetCompanys, useGetItems } from '../../services/companyAndItemServices';

export const AddSellBill = () => {

  var [StockQuantity, setStockQuantity] = useState(0)
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
    paymentType: {
      required: {
        value: true,
        message: "Payment Type is required."
      }
    },
    companyId: {
      required: {
        value: true,
        message: "Company name is required.",
      },
    },
    clientId: {
      required: {
        value: true,
        message: "CLient name is required.",
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
    // qty: {
    //   required: {
    //     value: true,
    //     message: "Quantity is required.",
    //   },
    //   min: {
    //     value: 1,
    //     message: "Minimum one quantity is required.",
    //   },
    //   max: {
    //     value: StockQuantity,
    //     message: `Maximum ${StockQuantity} quantity is required.`,
    //   },
    //   pattern: {
    //     value: /^[0-9.]+$/,
    //     message: "Only numbers are allowed.",
    //   },
    // },
    price: {
      required: {
        value: true,
        message: "Price is required.",
      },
      pattern: {
        value: /^[0-9.]+$/,
        message: "Only numbers are allowed.",
      },
    },
    sellbillno: {
      required: {
        value: true,
        message: "Sell bill number is required.",
      },
      minLength: {
        value: 1,
        message: "minimum words length is 1.",
      },
      maxLength: {
        value: 200,
        message: "maximum words length is 200.",
      },
      pattern: {
        value: /^[a-zA-Z0-9-]+$/,
        message: "Only alphanumeric characters and hyphens are allowed.",
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

  const navigate = useNavigate();

  const { data: stockData, isLoading: stockLoading } = useGetStockData();
  // const dispatch = useDispatch();
  // const stocksData = useSelector((state) => state.stock.value)
  
  
  // var itemsData = useSelector((state) => state.items.value);
  // var companiesData = useSelector((state) => state.company.value);
  
  const { data: clientData, isLoading: clientLoading } = useClientData();
  var {data:itemsData ,isLoading:itemDataLoading} = useGetItems();
  var { data: companiesData, isLoading: companiesDataLoading } = useGetCompanys();
  var {
    register: clientRegister,
    handleSubmit: clientSubmit,
    formState: { errors: clientError },
    watch
  } = useForm();
  var {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [clientDetails, setclientDetails] = useState({});
  const watchBillNo = watch("sellbillno"); 
  const watchDate = watch("date");
  const defferedBillNo = useDeferredValue(watchBillNo);
  const defferedDate = useDeferredValue(watchDate);


  const submitBeforeData = (data) => {
    setclientDetails(data)
  }
  var [ids, setids] = useState(1);
  var [sellItem, setsellItem] = useState([]);


  const submitData = (data) => {
    data.id = ids;
    setids((ids += 1));
    setsellItem([...sellItem, data]);
    // document.getElementById("forms").reset();
  };
  
  
  var [companyId, setcompanyId] = useState("");
  const getItemCompanyWise = (data) => {
    if (data !== "" && data !== null) {
      document.getElementById("items").disabled = false;
      setcompanyId(data);
    } else {
      document.getElementById("items").disabled = true;
    }
  };


  var [paymentDisable, setpaymentDisable] = useState(true)
  const getPaymentWise = (data) => {
    if (data == 1) {
      setpaymentDisable(false)
    } else {
      setpaymentDisable(true)
    }
  };

  const deleteItems = (id) => {
    sellItem = sellItem.filter((item) => item.id !== id);
    setsellItem(sellItem);
  };

  var [totalPrice, setTotalPrice] = useState(0);

  const setTotalRs = (price) => {
    var qty = document.getElementById("qty").value;
    if (qty <= 0) {
    } else {
      var p = price * qty;
      setTotalPrice(p);
      document.getElementById("totalPrice").value = p;
    }
  };

  const mutation = useAddSell();
  const addDataIntoPurchase = () => {
    clientDetails.items = sellItem;
    setclientDetails(clientDetails);
    mutation.mutate(clientDetails);
  };

  const setInstock = (data) => {
    StockQuantity = stockData?.data?.data?.find(ele => ele?.itemId?._id === data)?.qty
    setStockQuantity(StockQuantity)
  }

  var [note, setnote] = useState(0);

  var [sellbillError, setsellbillError] = useState(true)
  var billMutation = useGetUniqueBillNo();

  const getBillUnique = (number,date) => {
      billMutation.mutate({number,date});
  }

  useEffect(() => {
    if(defferedBillNo && defferedDate) {
      getBillUnique(defferedBillNo,defferedDate);
    }
  },[defferedBillNo,defferedDate])

  useEffect(() => {
    if (stockData !== undefined && stockLoading === false && stockData?.data?.data?.length === 0) {
      stockData.data.data.forEach(element => {
        // dispatch(addStock(element));
      });
    }
    if (mutation.isSuccess) {
      notifyDone("sell items added successfully.");
      navigate("/viewsellbill");
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
      console.log("is this run bro : ",billMutation.data);
      if (billMutation.data.data.data === false) {
        console.log("sell bill error seted");
        setsellbillError(false)
      } else {
        console.log("sell bill error removed");
        setsellbillError(true)
      }
    }
  }, [itemsData, companiesData, stockData, companyId, mutation, paymentDisable,billMutation]);

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
                <h3>Generate Sell Bill</h3>
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
                display: `${Object.keys(clientDetails).length === 0 ? "block" : "none"
                  }`,
              }}
            >
              <div className="card-header">
                <h4 className="card-title">Client and other info </h4>
              </div>
              <div className="card-body">
                <form onSubmit={clientSubmit(submitBeforeData)}>
                  <div className="row">
                    <div className="col-md-6">
                      <fieldset class="form-group mandatory">
                        <label htmlFor="vendor" class="form-label">
                          Select Client
                        </label>
                        <select
                          class="form-select"
                          id="client"
                          {...clientRegister("clientId", validation.clientId)}
                        >
                          <option className='search-dropdown' value="">Select client's name</option>
                          {clientData?.data?.data?.map((client) => {
                            return (
                              <option value={client._id}>
                                {client.name}
                              </option>
                            );
                          })}
                        </select>
                        <span className="text-danger font-weight-bold">
                          {clientError?.clientId?.message}
                        </span>
                      </fieldset>
                      <fieldset class="form-group mandatory">
                        <label htmlFor="paymentType" class="form-label">Select Payment Type:</label>
                        <select class="form-select" id="paymentType"
                          {...clientRegister("paymentType", validation.paymentType)}
                          onChange={(event) => {
                            getPaymentWise(event.target.value);
                          }}
                        >
                          <option value="">Select PaymentType</option>
                          <option value="1">Credit</option>
                          <option value="0">Debit</option>
                        </select>
                        <span className="text-danger font-weight-bold">
                          {clientError?.paymentType?.message}
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
                          {...clientRegister("date", validation.date)}
                        />
                        <span className="text-danger font-weight-bold">
                          {clientError?.date?.message}
                        </span>
                      </div>

                    </div>
                    <div className="col-md-6">
                      <div className="form-group mandatory">
                        <div className="d-flex justify-content-between">
                          <label htmlFor="invoice" class="form-label">
                            SellBill number
                          </label>
                          <span className="text-danger font-weight-bold mx-2" style={{ display: sellbillError == true ? "none" : "block" }}>
                            <b>Please, enter unique sellbill number</b>
                          </span>
                        </div>
                        <input
                          type="number"
                          className="form-control"
                          id="sellbillno"
                          placeholder="Enter your SellBill number"
                          // onKeyUp={(event) => getBillUnique(event.target.value)}
                          {...clientRegister("sellbillno", validation.sellbillno)}
                        />
                        <span className="text-danger font-weight-bold">
                          {clientError?.sellbillno?.message}
                        </span>
                      </div>

                      <div className="form-group mandatory">
                        <fieldset class="form-group mandatory">
                          <label htmlFor="paymentMode" class="form-label">Select Payment Mode</label>
                          <select class="form-select" id="paymentMode" disabled={paymentDisable}
                            {...clientRegister("paymentMode")}>
                            <option value="">Select PaymentMode</option>
                            <option value="Cash">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="Cheque">Cheque</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Debit Card">Debit Card</option>
                          </select>
                        </fieldset>
                        <div class="form-group mb-3">
                          <label for="remarks" class="form-label">
                            Remarks
                          </label>
                          <textarea
                            class="form-control"
                            maxLength="3000"
                            id="remarks"
                            rows="2"
                            {...clientRegister("remark", validation.remark)}
                            placeholder="Enter Remark"
                          ></textarea>
                        </div>
                        <span className="text-danger font-weight-bold">
                          {clientError?.remark?.message}
                        </span>

                      </div>
                      <button
                        type="submit"
                        class="btn btn-outline-primary me-1 mb-1"
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
                display: `${Object.keys(clientDetails).length !== 0 ? "block" : "none"
                  }`,
              }}
            >
              <div className="card-header">
                <h4 className="card-title">Genetate sell items</h4>
              </div>
              <div className="card-body">
                {clientLoading === true ||
                  clientData?.data?.data === undefined ? (
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
                        Client name :
                        {
                          clientData?.data?.data?.find(
                            (client) => client._id === clientDetails.clientId
                          )?.name
                        }
                      </p>
                      <p>Sell Bill Number : {clientDetails?.sellbillno} </p>
                      <p>Date : {clientDetails?.date} </p>
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
                          <label htmlFor="qty" class="form-label">
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
                          <label htmlFor="price" class="form-label">
                            Price of one unit
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="price"
                            placeholder="Enter quantity."
                            onKeyUpCapture={(event) =>
                              setTotalRs(event.target.value)
                            }
                            {...register("price", validation.price)}
                          />
                          <span className="text-danger font-weight-bold">
                            {errors?.price?.message}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <fieldset class="form-group mandatory">
                          <div className="d-flex justify-content-between">
                            <label htmlFor="items" class="form-label">
                              Select item
                            </label>
                            <span className='text-right text-danger mx-3'
                              hidden={StockQuantity === 0 ? true : false}
                            >In stock : {StockQuantity}</span>
                          </div>
                          <select
                            class="form-select"
                            id="items"
                            {...register("itemId", validation.itemId)}
                            disabled="true"
                            onChange={(event) => setInstock(event.target.value)}
                          >
                            <option value="">First select company</option>
                            {stockData?.data?.data?.map((item) => {
                              if (item?.itemId?.companyId === companyId) {
                                return (
                                  <option key={item?.itemId._id} value={item?.itemId._id}>
                                    {item.itemId?.name}
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
                        <div class="d-flex justify-content-between form-group">
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
                                  sellItem.length === 0 ? true : false
                                }
                              >
                                Process to Sell
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
                display: `${Object.keys(clientDetails).length !== 0 ? "block" : "none"
                  }`,
              }}
            >
              <div className="card-header">
                <h4 className="card-title">Sell Items </h4>
              </div>
              {sellItem.length === 0 ? (
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
                          <th>Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sellItem?.map((item) => {
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
                                <td>{Math.round(item.qty * item.price)}</td>
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
                    Are you sure you want to process to Sell?
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
          </section>
        </div>
      </div>
    </>
  )
}
