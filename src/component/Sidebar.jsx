import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';

export const Sidebar = (props) => {

    useEffect(() => {
        import('../assets/js/bootstrap.js');
        import('../assets/js/app.js');
    }, [])

    return (
        <div id='sidebar-id' style={{ display: props.isOpen === true ? "block" : "none" }}>
            <div id="sidebar" className="active">
                <div className="sidebar-wrapper active">
                    <div className="sidebar-header position-relative">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="logo">
                                {/* <h2>ERP</h2> */}
                                <h3>ERP </h3>
                                <h5>Repify</h5>
                            </div>
                            <div className="theme-toggle d-flex gap-2  align-items-center mt-2">
                                <svg
                                    aria-hidden="true"
                                    role="img"
                                    className="iconify iconify--system-uicons"
                                    width={20}
                                    height={20}
                                    preserveAspectRatio="xMidYMid meet"
                                    viewBox="0 0 21 21"
                                >
                                    <g
                                        fill="none"
                                        fillRule="evenodd"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path
                                            d="M10.5 14.5c2.219 0 4-1.763 4-3.982a4.003 4.003 0 0 0-4-4.018c-2.219 0-4 1.781-4 4c0 2.219 1.781 4 4 4zM4.136 4.136L5.55 5.55m9.9 9.9l1.414 1.414M1.5 10.5h2m14 0h2M4.135 16.863L5.55 15.45m9.899-9.9l1.414-1.415M10.5 19.5v-2m0-14v-2"
                                            opacity=".3"
                                        />
                                        <g transform="translate(-210 -1)">
                                            <path d="M220.5 2.5v2m6.5.5l-1.5 1.5" />
                                            <circle cx="220.5" cy="11.5" r={4} />
                                            <path d="m214 5l1.5 1.5m5 14v-2m6.5-.5l-1.5-1.5M214 18l1.5-1.5m-4-5h2m14 0h2"></path>
                                        </g>
                                    </g>
                                </svg>
                                <div className="form-check form-switch fs-6">
                                    <input
                                        className="form-check-input  me-0"
                                        type="checkbox"
                                        id="toggle-dark"
                                        style={{ cursor: "pointer" }}
                                    />
                                    <label className="form-check-label" />
                                </div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    aria-hidden="true"
                                    role="img"
                                    className="iconify iconify--mdi"
                                    width={20}
                                    height={20}
                                    preserveAspectRatio="xMidYMid meet"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="m17.75 4.09l-2.53 1.94l.91 3.06l-2.63-1.81l-2.63 1.81l.91-3.06l-2.53-1.94L12.44 4l1.06-3l1.06 3l3.19.09m3.5 6.91l-1.64 1.25l.59 1.98l-1.7-1.17l-1.7 1.17l.59-1.98L15.75 11l2.06-.05L18.5 9l.69 1.95l2.06.05m-2.28 4.95c.83-.08 1.72 1.1 1.19 1.85c-.32.45-.66.87-1.08 1.27C15.17 23 8.84 23 4.94 19.07c-3.91-3.9-3.91-10.24 0-14.14c.4-.4.82-.76 1.27-1.08c.75-.53 1.93.36 1.85 1.19c-.27 2.86.69 5.83 2.89 8.02a9.96 9.96 0 0 0 8.02 2.89m-1.64 2.02a12.08 12.08 0 0 1-7.8-3.47c-2.17-2.19-3.33-5-3.49-7.82c-2.81 3.14-2.7 7.96.31 10.98c3.02 3.01 7.84 3.12 10.98.31Z"
                                    ></path>
                                </svg>
                            </div>
                            <div className="sidebar-toggler x">
                                <a href="#" className="sidebar-hide d-xl-none d-block">
                                    <i className="bi bi-x bi-middle" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="sidebar-menu">
                        <ul className="menu">
                            <li className="sidebar-title">Menu</li>
                            <li className="sidebar-item active ">
                                {/* <a href="index.html" className="sidebar-link">
                                    <i className="bi bi-grid-fill" />
                                    <span>Dashboard</span>
                                </a> */}
                                <Link to="/" className="sidebar-link">
                                    <i className="bi bi-grid-fill" />
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                            <li className="sidebar-item  has-sub">
                                <a href="#" className="sidebar-link">
                                    <i className="bi bi-person-fill" />
                                    <span>Persons</span>
                                </a>
                                <ul className="submenu ">
                                    <li className="submenu-item ">
                                        <Link to="/client">Add clients</Link>
                                    </li>
                                    <li className="submenu-item ">
                                        <Link to="/clientlist">List clients</Link>
                                    </li>
                                    <li className="submenu-item ">
                                        <Link to="/vendor">Add vendors</Link>
                                    </li>
                                    <li className="submenu-item ">
                                        <Link to="/vendorlist">List vendors</Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="sidebar-title">Project Sections</li>
                            <li className="sidebar-item  has-sub">
                                <a href="#" className="sidebar-link">
                                    <i className="bi bi-collection-fill" />
                                    <span>Purchase</span>
                                </a>
                                <ul className="submenu ">
                                    <li className="submenu-item ">
                                        <Link to='/add-purchase'>Add purchase</Link>
                                    </li>
                                    <li className="submenu-item ">
                                        <Link to='/list-purchase'>List purchase</Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="sidebar-item  has-sub">
                                <a href="#" className="sidebar-link">
                                    <i className="bi bi-collection-fill" />
                                    <span>Sell</span>
                                </a>
                                <ul className="submenu ">
                                    <li className="submenu-item ">
                                        <Link to='/addsellbill'>Generate Sell Bill</Link>
                                    </li>
                                    <li className="submenu-item ">
                                        <Link to='/viewsellbill'>View Sell Bill</Link>
                                    </li>
                                    <li className="submenu-item ">
                                        <Link to='/datewisesellprice'>DateWise SellPrice</Link>
                                    </li>
                                    <li className="submenu-item ">
                                        <Link to='/datewiseItemlist'>DateWise Item Total Summary</Link>
                                    </li>
                                    <li className="submenu-item ">
                                        <Link to='/datewiseItemWise'>DateWise Item Summary</Link>
                                    </li>
                                    
                                </ul>
                            </li>
                            <li className="sidebar-title">Stocks</li>
                            <li className="sidebar-item  has-sub">
                                <a href="#" className="sidebar-link">
                                    <i class="bi bi-house-door-fill"></i>
                                    <span>Stocks</span>
                                </a>
                                <ul className="submenu ">
                                    <li className="submenu-item ">
                                        <Link to="/list-stock">List stocks</Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="sidebar-title">Companies & items</li>
                            <li className="sidebar-item  has-sub">
                                <a href="#" className="sidebar-link">
                                    <i class="bi bi-house-door-fill"></i>
                                    <span>Companies</span>
                                </a>
                                <ul className="submenu ">
                                    <li className="submenu-item ">
                                        <Link to="/add-company">Add company</Link>
                                    </li>
                                    <li className="submenu-item ">
                                        <Link to="/add-item">Add Items</Link>
                                    </li>
                                    <li className="submenu-item ">
                                        <Link to="/show-item">List Items</Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
