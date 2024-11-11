import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Modal, Select, Textarea, TextInput, Tooltip } from "flowbite-react";

const FlowbiteGenericTable = ({ data, colSize, setOpenDeleteModal, setOpenAddModal, setOpenUpdateModal, setOpenDetailsModal, setSelectedRow, selectedRow, rowData, handleViewFile, isDetailed, pageName }) => {
    const [columns, setColumns] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);

    };

    useEffect(() => {
        if (data && data.length > 0) {
            const flatObject = flattenObject(data[0]);
            const keys = Object.keys(flatObject);
            const orderedKeys = [];

            keys.forEach(key => {
                if (!orderedKeys.includes(key)) {
                    if (key !== "ID")
                        orderedKeys.push(key);
                }
            });

            setColumns(orderedKeys);



        }
    }, [data]);

    const flattenObject = (obj, parent = '', res = {}) => {
        for (let key in obj) {
            const propName = parent ? parent + ' ' + key : key;
            const propNameUp = propName.toLocaleUpperCase();
            if (typeof obj[key] == 'object') {
                flattenObject(obj[key], propNameUp, res);
            } else {
                res[propNameUp] = obj[key];
            }
        }
        return res;
    };

    const flattenData = data.map(item => flattenObject(item));
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = flattenData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(flattenData.length / rowsPerPage);

    if (!data || data.length === 0) {
        return <></>;
    }

    return (
        <div className=''>
            <section className="bg-slate-50 dark:bg-gray-900 px-3 py-6 sm:p-5 antialiased">
                <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                    <div className="bg-transparent dark:bg-gray-800 relative sm:rounded-lg overflow-hidden shadow-2xl">
                        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                            <div className="w-full md:w-1/2">
                                <button
                                    type="button"
                                    onClick={() => setOpenAddModal(true)}
                                    className="flex items-center justify-center text-white bg-sky-800 hover:bg-sky-600 focus:ring-4 focus:bg-palette-2 font-medium rounded-lg text-sm px-4 py-2 transition duration-250 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                                    <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                                    </svg>
                                    Add New {pageName ?? 'Entry'} 
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <div className="min-w-full max-w-full">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-white uppercase bg-sky-800 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            {columns.map((column, index) => (
                                                index < colSize && <th scope="col" className="px-4 py-4" key={column}>{column}</th>
                                            ))}
                                            <th scope="col" className="px-4 py-4 flex items-center justify-start">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentRows.map((row, rowIndex) => (
                                            <tr className="border-b dark:border-gray-700" key={rowIndex}>
                                                {columns.map((column, index) => (
                                                    index < colSize && <td className="px-4 py-3" key={column}>
                                                        {column === 'FILE' ? (
                                                            row[column] ? (
                                                                <a
                                                                    //  onClick={() => {  console.log(row);
                                                                    //   }}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-500 hover:underline"
                                                                > 
                                                                    <button onClick={() => {
                                                                     handleViewFile(row)} } className="">View File</button> 
                                                                </a>
                                                            ) : 'No File'
                                                        ) : column === 'LINK' ? (
                                                            row[column] ? (
                                                                <a
                                                                    href={row[column]}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-500 hover:underline"
                                                                >
                                                                    Open Link
                                                                </a>
                                                            ) : 'No Link'
                                                        ) : row[column]}
                                                    </td>
                                                ))}
                                                <td className="px-6 py-3 flex items-center justify-start">
                                                    <Dropdown
                                                        label={
                                                            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                            </svg>
                                                        }
                                                        inline
                                                    >
                                                        <Dropdown.Item onClick={() => { setOpenUpdateModal(true); { rowData ? setSelectedRow(flattenObject(rowData.filter(r => r.id === row.ID)[0])) : setSelectedRow(row) } }}>Edit</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => { setOpenDeleteModal(true); setSelectedRow(row); }} className="text-red-500">Delete</Dropdown.Item>
                                                        {isDetailed ? <Dropdown.Item onClick={() => { setOpenDetailsModal(true); { rowData ? setSelectedRow(flattenObject(rowData.filter(r => r.id === row.ID)[0])) : setSelectedRow(row) } }} className="text-blue-500">Details</Dropdown.Item> : ""}
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                    {/* <tbody>
                                        {currentRows.map((row, rowIndex) => (
                                            <tr className="border-b dark:border-gray-700" key={rowIndex}>
                                                {columns.map((column, index) => (
                                                    index < colSize && <td className="px-4 py-3" key={column}>{row[column]}</td>
                                                ))}
                                                <td className="px-6 py-3 flex items-center justify-start">
                                                    <Dropdown
                                                        label={
                                                            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                            </svg>
                                                        }
                                                        inline
                                                    >
                                                        <Dropdown.Item onClick={() => { setOpenUpdateModal(true); setSelectedRow(row); }}>Edit</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => { setOpenDeleteModal(true); setSelectedRow(row); }} className="text-red-500">Delete</Dropdown.Item>
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody> */}
                                </table>
                            </div>
                        </div>

                        <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                Showing <span className="font-semibold text-gray-900 dark:text-white">{((currentPage - 1) * 10) + 1}-{(data.length < currentPage * 10 ? data.length : currentPage * 10)} </span> of <span className="font-semibold text-gray-900 dark:text-white">{data.length}</span>
                            </span>

                            <ul className="inline-flex items-stretch -space-x-px">
                                <li>
                                    <a
                                        href="#"
                                        className={`flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === 1 ? 'cursor-not-allowed' : ''}`}
                                        onClick={() => {
                                            if (currentPage > 1) {
                                                handlePageChange(currentPage - 1);
                                            }
                                        }}
                                        disabled={currentPage === totalPages}
                                    >
                                        <span className="sr-only">Previous</span>
                                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </li>
                                {[...Array(totalPages)].map((_, index) => (
                                    <li key={index}>
                                        <a
                                            href="#"
                                            className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${currentPage === index + 1 ? 'z-10 text-primary-600 bg-primary-50 border border-primary-300' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}`}
                                            onClick={() => handlePageChange(index + 1)}
                                        >
                                            {index + 1}
                                        </a>
                                    </li>
                                ))}
                                <li>
                                    <a
                                        href="#"
                                        className={`flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === totalPages ? 'cursor-not-allowed' : ''}`}
                                        onClick={() => {
                                            if (currentPage < totalPages) {
                                                handlePageChange(currentPage + 1);
                                            }
                                        }}
                                        disabled={currentPage === totalPages}
                                    >
                                        <span className="sr-only">Next</span>
                                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </section>
        </div>
    );

};

export default FlowbiteGenericTable;