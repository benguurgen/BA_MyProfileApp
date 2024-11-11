import React from 'react'
import { toast } from 'react-toastify'

const ToastService ={
    toastSuccess(message,theme=null){
        baseToast("success",message,theme)
    },
    toastWarning(message,theme=null){
        baseToast("warn",message,theme)
    },
    toastError(message,theme=null){
        baseToast("error",message,theme)
    },
    toastInfo(message,theme=null){
        baseToast("info",message,theme)
    }    
}

function baseToast(type,message,theme=null){
    toast[type](message, { 
        autoClose: 3000,
        theme: theme==="dark"?"dark":"colored",
    });
}

export default ToastService