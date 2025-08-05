import { Margin } from '@mui/icons-material';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
// import "../../assets/css/bootstrap.css"

export const SellBillPrintComponent = (props) => {

    const id = useParams().id;
    var itmId = 0;
    var [grandTotal, setgrandTotal] = useState(0)
    var [SellItems, setSellItems] = useState({})

    const [note, setnote] = useState(0)
    useEffect(() => {
        props.onClose()
        if (note === 0) {
            SellItems = props.items?.filter(itm => itm._id === id)[0];
            setSellItems(SellItems)
            SellItems?.items.forEach(element => {
                grandTotal += element.qty * element.price;
                setgrandTotal(grandTotal)
            });
            setnote(1)
        }
    }, [])
    return (
        <>
            {
                !SellItems ? (
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
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="d-flex justify-content-between">
                                    <div className="col-xs-6">
                                        <address>
                                            <strong>Cash/debit memo</strong>
                                            <br />
                                            Pan number : BQBPR6996Q
                                        </address>
                                    </div>
                                    <div className="col-xs-6">
                                        <address>
                                            <strong>Subject to KHEDBRAHMA Jurisdiction</strong>
                                        </address>
                                    </div>
                                    <div className="col-xs-6">
                                        <address>
                                            <strong>Pro.Darshitbhai M. Raval</strong>
                                            <br />
                                            Mo. 9724384019
                                        </address>
                                    </div>
                                </div>
                                <div className="invoice-title d-flex justify-content-center">
                                    <h1>D.M Sales agency</h1>
                                </div>
                                <hr />
                                <h5 className='text-center'>Sammati Market, Ambaji Highway, Khedbrahma(SK)</h5>
                                <hr />
                                <div className="row px-4">
                                    <div className="col-6">
                                        <address>
                                            <strong>Bill No : {SellItems?.sellbillno}</strong>
                                            <br />
                                            <strong>Name : {SellItems?.clientId?.name}</strong>
                                            <br />
                                            <strong>Centre : {SellItems?.clientId?.address}</strong>
                                        </address>
                                    </div>
                                    <div className="col-6">
                                        <address>
                                            <strong>Date: {`${SellItems?.date?.substring(0, 10).split('-')[2]} - ${SellItems?.date?.substring(0, 10).split('-')[1]} - ${SellItems?.date?.substring(0, 10).split('-')[0]}`}</strong>
                                            <br />
                                            <strong>Mobile No : {SellItems?.clientId?.phoneNumber}</strong>
                                            <br />
                                        </address>
                                    </div>
                                </div>
                                <div className="row px-4">
                                    <div className="col-6">
                                        <address>
                                            <strong>Payment type : {SellItems?.paymentType === 0 ? "Debit" : "Credit"}</strong>
                                            <br />
                                        </address>
                                    </div>
                                    <div className="col-6">
                                        <address>
                                            <strong>Payment mode : {SellItems?.paymentType === 0 ? "No" : SellItems?.paymentMode}</strong>
                                            <br />
                                        </address>
                                    </div>
                                </div>
                                <hr />
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h3 className="panel-title">
                                            <strong>Order summary</strong>
                                        </h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="table-responsive">
                                            <table className="table table-condensed">
                                                <thead className='bg-primary text-black'>
                                                    <tr>
                                                        <td>
                                                            <strong>ID</strong>
                                                        </td>
                                                        {/* <td className="text-center">
                                                            <strong>COMPANY</strong>
                                                        </td> */}
                                                        <td className="text-center">
                                                            <strong>ITEM</strong>
                                                        </td>
                                                        <td className="text-right">
                                                            <strong>QUANTITY</strong>
                                                        </td>
                                                        <td className="text-right">
                                                            <strong>RATE</strong>
                                                        </td>
                                                        <td className="text-right">
                                                            <strong>TOTAL</strong>
                                                        </td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        SellItems?.items?.map(itm => {
                                                            return (
                                                                <tr>
                                                                    <td>{++itmId}</td>
                                                                    {/* <td className="text-center">{itm.companyId?.name}</td> */}
                                                                    <td className="text-center" >{itm.itemId?.name}</td>
                                                                    <td className="text-right">{itm?.qty}</td>
                                                                    <td className="text-right">{itm?.price}</td>
                                                                    <td className="text-right">{Math.round(itm?.qty * itm?.price)}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                    <br />
                                                    <tr>
                                                        <td className="no-line" />
                                                        <td className="no-line" />
                                                        <td className="no-line" />
                                                        <td className="no-line" />
                                                        <td className="no-line">
                                                            <strong className='text-black'>Grand Total</strong>
                                                        </td>
                                                        <td className="text-black"><b>{Math.round(grandTotal)}/-</b></td>
                                                    </tr>
                                                    <br />
                                                    <br />
                                                    <tr>
                                                        <td className="no-line" />
                                                        <td className="no-line" />
                                                        <td className="no-line" />
                                                        <td className="no-line" />
                                                        <td className="no-line" />
                                                        <td className="text-black"><b className=''>Signature</b></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}
