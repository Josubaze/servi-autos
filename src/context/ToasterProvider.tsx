'use client'
import React from 'react';

import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const ToasterProvider = ({
    children,
  }: {
    children: ReactNode;
  }) => {
    return (
        <>
            {children}
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </>
    );
}

export default ToasterProvider;
