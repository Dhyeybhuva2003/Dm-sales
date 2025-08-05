import React, { useEffect } from 'react'
import error from "../../assets/images/samples/error-404.svg"
import { Link } from 'react-router-dom'

export const Error404 = (props) => {

    useEffect(() => {
        props.onClose()
    }, [])

    return (
        <div id="error">
            <div class="error-page container">
                <div class="col-md-8 col-12 offset-md-2">
                    <div class="text-center">
                        <img class="img-error" src={error} alt="Not Found" />
                        <h1 class="error-title">NOT FOUND</h1>
                        <p class='fs-5 text-gray-600'>The page you are looking not found.</p>
                        <Link to="/" class="btn btn-lg btn-outline-primary mt-3">Go Home</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
