import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import {
    Button,
    Datepicker,
    Dropdown,
    Modal,
    Select,
    Textarea,
    TextInput,
} from "flowbite-react";
import FlowbiteGenericTable from "../Tables/FlowbiteGenericTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { Api } from "../api/Api";
import { width } from "@fortawesome/free-brands-svg-icons/fa42Group";

const Event = () => {
    const [errors, setErrors] = useState({});
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [date, setDate] = useState(new Date());
    const [data, setData] = useState([]);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState('');
    const [rowUpdated, setRowUpdated] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [formChanged, setFormChanged] = useState(false); 

    const getFirstError = (fieldName) => {
        if (errors[fieldName]) {
            return Array.isArray(errors[fieldName]) 
                ? errors[fieldName][0] 
                : errors[fieldName];
        }
        return null;
    };


    const handleButtonClick = () => {
        if (formChanged) {
          fileInputRef.current.click();
        } else {
          console.warn("No changes made in the form.");
        }
      };

      const initialSelectedRow = {
        ID: null,
        TITLE: '',
        DATE: new Date(),
        EVENTTYPE: '',
        LINK: '',
        FILE: null
      };


    const formatDateToDateFns = (date) => {
        return format(date, "yyyy-MM-dd'T'HH:mm:ss");
    };

    const handleDateChange = (date) => {

        selectedRow.DATE = formatDateToDateFns(date);

        if (selectedRow.DATE > formatDateToDateFns(new Date())) {
            errors.DATE = '';
        }
        const { name, value } = date;
        setSelectedRow({ ...selectedRow, [name]: value });
    };
    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setErrors({});
    };
    const handleEventType = (eventType) => {
        const tarEventType = eventType.target.value;
        selectedRow.EVENTTYPE =
            tarEventType === "1"
                ? "Seminar"
                : tarEventType === "2"
                    ? "Career Fair"
                    : "Networking";
        const { name, value } = selectedRow.EVENTTYPE;
        setSelectedRow({ ...selectedRow, [name]: value });
    };

    const eventTypeMap = {
        1: "Seminar",
        2: "Career Fair",
        3: "Networking",
    };
    useEffect(() => {

        getAllEvents();
    }, []);

    useEffect(() => {
        if (openAddModal || openUpdateModal) {
            setErrors({});
        }
    }, [openAddModal, openUpdateModal]);

    useEffect(() => {
        if (openAddModal) {
          setDate(new Date()); 
        }
      }, [openAddModal]); 

    useEffect(() => {
        setFormChanged(Object.keys(selectedRow).length > 0);
      }, [selectedRow]);

    const onDateChange = (date) => {
        setDate(date);

        if ((formatDateToDateFns(date) > formatDateToDateFns(new Date()))) {
            errors.DATE = '';
        }
    }

    const onChange = (e) => {
    setRowUpdated(true);

    e.target.value = e.target.value.trimLeft();
    
        const { name, value } = e.target;
        const input = e.target.value;
        
        if (e.target.name === "TITLE" && input.length > 1 && input.length < 51) {
            errors.TITLECHARS = '';
            errors.TITLELENGTH = '';
        }
        if(e.target.name === "LINK" && input.length <= 2000){
            errors.LINK = '';
        }

        setSelectedRow({ ...selectedRow, [name]: value });
    };  

    const onClose = (method) => {
        if (Object.keys(errors).length > 0) {
            setErrors('');
        }
        setFile(null);
        setFileName('');
        method(false);
    };

    const getAllEvents = async () => {
        try {
            await Api.handleRequestGetAsync(
                "https://localhost:7052/api/Event/GetAll"
            ).then((response) => {
                if (response.status === 200) {

                    let updatedData = response.data.data.map((e) => ({
                        ...e,
                        DATE: new Date(e.DATE),
                        eventType: eventTypeMap[e.eventType]
                    }));

                    setData(updatedData);
                    setFile(null);
                    setFileName('');



                } else {
                }
            });
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        
        if (selectedFile ) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
      

    };
    const handleCreateSubmit = async (e) => {
        e.preventDefault();

        const title = e.target[0].value;
        const link = e.target[1].value;
        const date = e.target[2].value;
        const eventType = e.target[5].value;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('date', formatDateToDateFns(date));
        formData.append('eventType', parseInt(eventType, 10));
        formData.append('link', link.startsWith('http') ? link : 'http://'+link);
        formData.append('file', file);

        try {
            const response = await Api.handleRequestPostAsync(
                "https://localhost:7052/api/Event/Create",
                formData,
                false
            );
            if (response.status === 200) {
                await getAllEvents();
                setOpenAddModal(false);
            } else {
                setErrors(response.errors || {});
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
        setRowUpdated(false);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        const hasChanges = Object.keys(selectedRow).some(key => selectedRow[key] !== initialSelectedRow[key]);

        if(rowUpdated || hasChanges || file) {
            setRowUpdated(false);

            const elements = [];
            for (let index = 0; index < e.target.length; index++) {
                elements.push(e.target[index]);
            }
            const title = elements.find(n => n.name === "TITLE").value;
            const link = elements.find(n => n.name === "LINK").value;
            const date = elements.find(n => n.name === "DATE").value;
            const eventType = elements.find(n => n.name === "EVENTTYPE").value;

            const formData = new FormData();
            formData.append('id', selectedRow.ID)
            formData.append('title', title);
            formData.append('link', link ? (link.startsWith('http') ? link : 'http://' + link) : '');
            formData.append('date', formatDateToDateFns(date));
            formData.append('eventType', parseInt(eventType, 10));
            if (file) {
                formData.append('file', file);
              } else if (selectedRow.FILE) {
                const existingFile = new File([selectedRow.FILE], "existingFile.pdf", { type: "application/pdf" });
                formData.append('file', existingFile);
              }        
            try {
                const { name, value } = e.target;
                setSelectedRow({ ...selectedRow, [name]: value });
                const response = await Api.handleRequestPutAsync(
                    "https://localhost:7052/api/Event/Update",
                    formData
                );
                if (response.status === 200) {
                    await getAllEvents();
                    setOpenUpdateModal(false);
                } else {
                    setErrors(response.errors || {});
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        }
    };
    
    const handleDeleteSubmit = async (e) => {
        e.preventDefault();
        try {


            await Api.handleRequestDeleteAsync(
                "https://localhost:7052/api/Event/Delete", selectedRow.ID
            ).then(async () => {
                await getAllEvents();
            });
            setOpenDeleteModal(false);

        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    const handleViewFile = (row) => {


        if (!row.FILE) return;

        const byteCharacters = atob(row.FILE);
        const byteNumbers = Array.from(byteCharacters, c => c.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        window.open(url, '_blank');

        setTimeout(() => URL.revokeObjectURL(url), 120000);
    };



    return (
        <>
            <FlowbiteGenericTable
                data={data}
                colSize={5}
                setOpenAddModal={setOpenAddModal}
                setOpenUpdateModal={setOpenUpdateModal}
                setOpenDeleteModal={setOpenDeleteModal}
                setSelectedRow={setSelectedRow}
                handleViewFile={handleViewFile}
                selectedRow={selectedRow}
                pageName={'Event'}
            />
<Modal
                show={openAddModal}
                size="md"
                popup
                onClose={() => onClose(setOpenAddModal)}
            >
                <Modal.Header>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white pl-2">
                        Create New Event
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleCreateSubmit} className="p-4 md:p-5">
                        <div className="grid gap-4 mb-4 grid-cols-2">
                            <div className="col-span-2">
                                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Title:
                                </label>
                                <TextInput
                                    label="title"
                                    id="TITLE"
                                    name="TITLE"
                                    type="text"
                                    placeholder="Title"
                                    onChange={onChange}
                                />
                                {getFirstError('Title') && (
                                    <div className="text-red-500 text-sm mt-1">{getFirstError('Title')}</div>
                                )}
                            </div>
                            <div className="col-span-2">
                                <label
                                    htmlFor="link"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Link:
                                </label>
                                <TextInput
                                    label="link"
                                    id="LINK"
                                    name="LINK"
                                    type="text"
                                    placeholder="Link"
                                    onChange={onChange}
                                />
                                {errors.Link && (
                                    <div className="text-red-500 text-sm mt-1">{errors.Link}</div>
                                )}
                            </div>
                            <div className="col-span-2">
                                <label
                                    htmlFor="datePicker"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Date:
                                </label>

                                <DatePicker
                                    name="DATE"
                                    selected={date}
                                    onChange={onDateChange}
                                    showTimeSelect
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    timeFormat="HH:mm"
                                    className="p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                                />

                                {errors.Date && (
                                    <div className="text-red-500 text-sm mt-1">{errors.Date}</div>
                                )}
                            </div>
                            <div className="col-span-2">
                                <label
                                    htmlFor="file"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    File:
                                </label>
                                <button type="button" className="bg-palette-5 rounded-md text-white hover:bg-blue-300 hover:text-blue-950 p-5 mr-5 transition-colors duration-300" onClick={handleButtonClick}>
                                    Select File...
                                </button>
                                <label>
                                    {fileName}
                                </label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                {getFirstError('File') && (
                                    <div className="text-red-500 text-sm mt-1">{getFirstError('File')}</div>
                                )}
                                {errors.FILE && (
                                    <div style={{ color: "red" }}>{errors.FILE}</div>
                                )}
                                {errors.FILENAME && (
                                    <div style={{ color: "red" }}>{errors.FILENAME}</div>
                                )}
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <Select id="eventType" onChange={onChange}>
                                    <option value="1">Seminar</option>
                                    <option value="2">Career Fair</option>
                                    <option value="3">Networking</option>
                                </Select>
                            </div>




                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                size="md"
                                className="text-white inline-flex items-center bg-palette-5  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2.5 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <svg
                                    className="me-1 -ms-1 w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                                Create
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            {/* UPDATEMODALL */}
            <Modal
                show={openUpdateModal}
                size="md"
                popup
                onClose={() => onClose(setOpenUpdateModal)}
            >
                <Modal.Header>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white pl-2">
                        Update Event
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleUpdateSubmit} className="p-4 md:p-5">
                        <div className="grid gap-4 mb-4 grid-cols-2">
                            <div className="col-span-2">
                                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Title:
                                </label>
                                <TextInput
                                    label="title"
                                    id="TITLE"
                                    name="TITLE"
                                    type="text"
                                    value={selectedRow.TITLE}
                                    placeholder="Title"
                                    onChange={onChange}
                                />
                                {getFirstError('Title') && (
                                    <div className="text-red-500 text-sm mt-1">{getFirstError('Title')}</div>
                                )}
                                {errors.TITLELENGTH && (
                                    <div className="text-red-500 text-sm mt-1">{errors.TITLELENGTH}</div>
                                )}
                                {errors.TITLECHARS && (
                                    <div className="text-red-500 text-sm mt-1">{errors.TITLECHARS}</div>
                                )}
                            </div>
                            <div className="col-span-2">
                                <label
                                    htmlFor="link"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Link: {selectedRow.LINK && (
                                        <a href={selectedRow.LINK} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            Go to link ({selectedRow.LINK.length > 30 ? selectedRow.LINK.substring(0, 30) + "..." : selectedRow.LINK} )
                                        </a>
                                    )}
                                </label>
                                <TextInput
                                    label="link"
                                    id="LINK"
                                    name="LINK"
                                    type="text"
                                    value={selectedRow.LINK}
                                    placeholder="Link"
                                    onChange={onChange}
                                />
                                {errors.Link && (
                                    <div className="text-red-500 text-sm mt-1">{errors.Link}</div>
                                )}
                            </div>
                            <div className="col-span-2">
                                <label
                                    htmlFor="Date"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Date:
                                </label>

                                <DatePicker
                                    name="DATE"
                                    selected={new Date(selectedRow.DATE)}
                                    onChange={(date) => handleDateChange(date)}
                                    showTimeSelect
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    timeFormat="HH:mm"
                                    className="p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                                />

                                {errors.Date && (
                                    <div className="text-red-500 text-sm mt-1">{errors.Date}</div>
                                )}
                            </div>
                            <div className="col-span-2">
                                <label
                                    htmlFor="file"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    File: {selectedRow.FILE && <button type="button" onClick={()=>{handleViewFile(selectedRow)}} className="text-blue-500 hover:underline">View PDF ( {selectedRow.TITLE.length > 20 ? selectedRow.TITLE.substring(0,20)+"...":selectedRow.TITLE}.pdf )</button>}
                                </label>
                                <button type="button" className="bg-palette-5 rounded-md text-white hover:bg-blue-300 hover:text-blue-950 p-5 mr-5 transition-colors duration-300" onClick={handleButtonClick}>
                                    Select File...
                                </button>
                                <label>
                                    {fileName.length > 30 ? fileName.substring(0,30)+"..." : fileName}
                                </label>
                                <input
                                    type="file"
                                    name="FILE"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />                                
                                {getFirstError('File') && (
                                    <div className="text-red-500 text-sm mt-1">{getFirstError('File')}</div>
                                )}
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <Select
                                    id="eventType"
                                    name="EVENTTYPE"
                                    onChange={(eventType) => handleEventType(eventType)}
                                    value={
                                        selectedRow.EVENTTYPE === "Seminar"
                                            ? 1
                                            : selectedRow.EVENTTYPE === "Career Fair"
                                                ? 2
                                                : 3
                                    }
                                >
                                    <option value="1">Seminar</option>
                                    <option value="2">Career Fair</option>
                                    <option value="3">Networking</option>
                                </Select>
                                {errors.EventType && (
                                    <div className="text-red-500 text-sm mt-1">{errors.EventType}</div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                size="md"
                                className="text-white inline-flex items-center bg-palette-5  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2.5 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <svg
                                    className="me-1 -ms-1 w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                                Update
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            <Modal
                show={openDeleteModal}
                size="md"
                popup
                onClose={handleCloseDeleteModal}
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <svg
                            className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p className="mb-4 text-gray-500 dark:text-gray-300">
                            Are you sure you want to delete this item?
                        </p>
                        <div className="flex justify-center items-center space-x-4">
                            <Button color="light" onClick={handleCloseDeleteModal}>
                                No, cancel
                            </Button>
                            <Button color="failure" onClick={handleDeleteSubmit}>
                                Yes, I'm sure
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Event;
