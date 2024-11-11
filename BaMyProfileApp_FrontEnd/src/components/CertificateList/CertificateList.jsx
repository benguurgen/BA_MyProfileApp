import React, { useState, useEffect ,useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Datepicker,
  Dropdown,
  Label,
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
import { CertificateService } from "../services/CertificateService";

const CertificateList = () => {
  const [errors, setErrors] = useState({});
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState([]);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
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

  // Modal her açıldığında güncel saati ve formu sıfırla
  useEffect(() => {
    if (openAddModal) {
      setDate(new Date()); 
      setFile(null); 
      setFileName(''); 
      setSelectedRow(initialSelectedRow);
      setErrors({}); 
    }
  }, [openAddModal]);
  



  const formatDateToDateFns = (date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm:ss");
  };

  const handleDateChange = (date) => {
    selectedRow.CERTIFICATEDATE = date;
    if (selectedRow.CERTIFICATEDATEDATE > formatDateToDateFns(new Date())) {
      errors.DATE = '';
  }
    const { name, value } = date;
    setSelectedRow({ ...selectedRow, [name]: value });
  };
  useEffect(() => {
    getAllCertificates();
  }, []);

  useEffect(() => {
    setFormChanged(Object.keys(selectedRow).length > 0);
  }, [selectedRow]);

  const handleButtonClick = () => {
    if (formChanged) {
      fileInputRef.current.click();
    } else {
      console.warn("No changes made in the form.");
    }
  };

  const initialSelectedRow = {
    ID: null,
    NAME: '',
    CERTIFICATEDATE: new Date(),
    DESCRIPTION: '',
    FILE: null
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile ) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setSelectedRow((prevState) => ({
        ...prevState,
        FILE: selectedFile
      }));
    } 
  };

  const onChange = (e) => {
    e.target.value = e.target.value.trimLeft();
    setRowUpdated(true);

    const { name, value } = e.target;
    setSelectedRow({ ...selectedRow, [name]: value });
  };



  // const validationControl = (name, certificateDate, description,file) => {
  //   let validationErrors = {};

  //   if (!name) {
  //     validationErrors.NAME = "Certificate name cannot be empty.";
  //   } else if (name.length < 2) {
  //     validationErrors.NAME =
  //       "Certificate name cannot be less than 2 characters.";
  //   } else if (name.length > 256) {
  //     validationErrors.NAME = "Certificate name cannot exceed 256 characters.";
  //   } 
  //   else if (name.length > 1 &&!/^([a-zA-ZğüşöçıİĞÜŞÖÇı0-9\s]+)$/.test(name)) {
  //     validationErrors.NAME =
  //       "Certificate name can contain only letters and numbers.";
  //   }

  //   if (!certificateDate) {
  //     validationErrors.CERTIFICATEDATE = "Certificate date cannot be empty.";
  //   }
  //   else if(new Date(certificateDate)>new Date()){
  //     validationErrors.CERTIFICATEDATE = "Certificate date less than or equal to now.";
  //   }

  //   if (!description) {
  //     validationErrors.DESCRIPTION = "Certificate description cannot be empty.";
  //   } else if (description.length < 2) {
  //     validationErrors.DESCRIPTION =
  //       "Certificate description cannot be less than 2 characters.";
  //   } else if (description.length > 256) {
  //     validationErrors.DESCRIPTION =
  //       "Certificate description cannot exceed 256 characters.";
  //   } 
  //   // else if (description.length > 1 && !/^([a-zA-ZğüşöçıİĞÜŞÖÇı0-9\s]+)$/.test(description)) {
  //   //   validationErrors.DESCRIPTION =
  //   //     "Certificate description can contain only letters and numbers.";
  //   // }

  //   //Certificate File
  //   if(!file)
  //   {
  //     validationErrors.FILE = "Certificate file cannot be empty."
  //   }


  //   setErrors(validationErrors);
  //   return Object.keys(validationErrors).length === 0;
  // };

  const getAllCertificates = async () => {
    try {
      var response = await Api.handleRequestGetAsync("https://localhost:7052/api/Certificate/GetAll").then((res) => {
        console.log(res);
        setData(res.data);
        if (res.status === 200) {
          
          let updatedData = null;
          updatedData = res.data.data.map((e) => ({
            ...e,
            CERTIFICATEDATE: new Date(e.CERTIFICATEDATE),
          }));

          setData(updatedData);
          
          setFile(null);
          setFileName('');
        } 
      })
      console.log(response);

    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    const name = e.target[0].value;
    const certificateDate = e.target[1].value;
    const description = e.target[2].value;
    const file = e.target[4].files[0];

    const data = {
      name: name,
      certificateDate: formatDateToDateFns(certificateDate),
      description: description,
      file:file,
    };
    const formData = new FormData();
    formData.append('name', name);
    formData.append('certificateDate', formatDateToDateFns(date));
    formData.append('description', description);
    formData.append('file', file);
    
    try {
      const response = await Api.handleRequestPostAsync(
          "https://localhost:7052/api/Certificate/Create",
          formData,
          false
      );
      if (response.status === 200) {
          await getAllCertificates();
          setOpenAddModal(false);

          setDate(new Date()); 
          setFile(null); 
          setFileName(''); 
          setErrors({});
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
    // if(e.target[0].value!==notUpdatedRow.NAME||formatDateToDateFns(e.target[1].value)!==formatDateToDateFns(notUpdatedRow.CERTIFICATEDATE)||e.target[2].value!==notUpdatedRow.DESCRIPTION|| file!=null)

    const hasChanges = Object.keys(selectedRow).some(key => selectedRow[key] !== initialSelectedRow[key]);

    if(rowUpdated || hasChanges || file)
      {
        setRowUpdated(false);

        const elements = [];
                for (let index = 0; index < e.target.length; index++) {
                    elements.push(e.target[index]);
                }
                const name = elements.find(n => n.name === "NAME").value;
        const description = elements.find(n => n.name === "DESCRIPTION").value;
        const certificateDate = elements.find(n => n.name === "CERTIFICATEDATE").value;
        
        const formData = new FormData();
        formData.append('id',selectedRow.ID);
        formData.append('name', name);
        formData.append('certificateDate', formatDateToDateFns(certificateDate));
        formData.append('description', description);
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
            "https://localhost:7052/api/Certificate/Update",
            formData
          );
          if (response.status === 200) {
            await getAllCertificates();
            setOpenUpdateModal(false);
            setDate(null); 
          setFile(null); 
          setFileName(''); 
          setErrors({});
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


      await CertificateService.delete(selectedRow.ID)

      await getAllCertificates();
      // ToastService.toastSuccess("Event successfully deleted");
      setOpenDeleteModal(false);
    } catch (error) {
      // ToastService.toastError("An error occurred while deleting the program")
      console.error("An error occurred:", error);
    }
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setErrors({});
    setSelectedRow(initialSelectedRow); 
    setFile(null); 
    setFileName("");
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setErrors({});
    setSelectedRow(initialSelectedRow); 
    setFile(null); 
    setFileName("");
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setErrors({});
    setSelectedRow(initialSelectedRow);
  };
  
  function isPdf(data) {
    const header = data.slice(0, 4);
    return header === '%PDF';
  }
  
  function detectMimeType(byteArray) {
    const stringData = new TextDecoder().decode(byteArray);
  
    if (isPdf(stringData)) {
        return 'application/pdf';
    }
    // Diğer türler için eklemeler yapılabilir
  
    return 'image/jpeg';
  }

  const handleViewFile = (row) => {
        

    if (!row.FILE) return;

    const byteCharacters = atob(row.FILE);
    const byteNumbers = Array.from(byteCharacters, c => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
   
    const blob = new Blob([byteArray], { type: detectMimeType(byteArray) });
    const url = URL.createObjectURL(blob);

    window.open(url, '_blank');
    setSelectedRow[""];
    setTimeout(() => URL.revokeObjectURL(url), 120000);

};

return (
    <>
      <FlowbiteGenericTable
        data={data}
        colSize={4}
        setOpenAddModal={setOpenAddModal}
        setOpenUpdateModal={setOpenUpdateModal}
        setOpenDeleteModal={setOpenDeleteModal}
        handleViewFile={handleViewFile}
        setSelectedRow={setSelectedRow}
        pageName={'Certificate'}
      />

      <Modal
        show={openAddModal}
        size="md"
        popup
        onClose={handleCloseAddModal}
      >
        <Modal.Header>
          <div className="text-lg font-semibold text-gray-900 dark:text-white pl-2">
            Create New Certificate
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleCreateSubmit} className="p-4 md:p-5">
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label
                  htmlFor="title"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Title
                </label>
                <TextInput
                  label="name"
                  id="NAME"
                  name="NAME"
                  type="text"
                  placeholder="Certificate Name"
                  onChange={onChange}
                  
                />
                {errors.Name && (
                  <div style={{ color: "red" }}>{errors.Name}</div>
                )}
                <div className="col-span-2">
                  <label
                    htmlFor="datePicker"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Date
                  </label>

                  <DatePicker
                    name="CERTIFICATEDATE"
                    selected={date}
                    onChange={(date) => setDate(date)}
                    showTimeSelect
                    dateFormat="yyyy-MM-dd HH:mm"
                    timeFormat="HH:mm"
                    className="p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                    
                  />
                  {errors.CertificateDate && (
                  <div style={{ color: "red" }}>{errors.CertificateDate}</div>
                )}

                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="content"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Description
                  </label>
                  <Textarea
                    className="pl-2 pt-2"
                    label="descripton"
                    id="DESCRIPTION"
                    name="DESCRIPTION"
                    rows="4"
                    placeholder="Descripton"
                    onChange={onChange}
                  />
                  {errors.Description && (
                  <div style={{ color: "red" }}>{errors.Description}</div>
                )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="file"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  File
                </label>
                <button
                  type="button"
                  className="bg-palette-5 rounded-md text-white hover:bg-blue-300 hover:text-blue-950 p-5 mr-5 transition-colors duration-300"
                  onClick={handleButtonClick}
                >
                  Select File...
                </button>
                <label>{fileName}</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                {errors.File && (
                  <div style={{ color: "red" }}>{errors.File}</div>
                )}
                {errors.FileName && (
                  <div style={{ color: "red" }}>{errors.FileName}</div>
                )}
              </div>
                  
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
        onClose={handleCloseUpdateModal}
      >
        <Modal.Header>
          <div className="text-lg font-semibold text-gray-900 dark:text-white pl-2">
            Update Certificate
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdateSubmit} className="p-4 md:p-5">
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Name
                </label>
                <TextInput
                  label="name"
                  id="NAME"
                  name="NAME"
                  type="text"
                  placeholder="Certificate Name"
                  onChange={onChange}
                  value={selectedRow.NAME}
                  
                />
                  {getFirstError('Name') && (
                                    <div className="text-red-500 text-sm mt-1">{getFirstError('Name')}</div>
                                )}
                  {errors.NAMELENGTH && (
                                    <div className="text-red-500 text-sm mt-1">{errors.NAMELENGTH}</div>
                                )}
                  {errors.NAMECHARS && (
                                    <div className="text-red-500 text-sm mt-1">{errors.NAMECHARS}</div>
                                )}              
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="datePicker"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Date
                </label>

                <DatePicker
                  name="CERTIFICATEDATE"
                  selected={new Date(selectedRow.CERTIFICATEDATE)}
                  onChange={(date) => handleDateChange(date)}
                  showTimeSelect
                  dateFormat="yyyy-MM-dd HH:mm"
                  timeFormat="HH:mm"
                  className="p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                  
                />
                 {errors.CertificateDate && (
                                    <div className="text-red-500 text-sm mt-1">{errors.CertificateDate}</div>                              )}
              </div>
              <label>Description</label>
              <div className="col-span-2">
                <Textarea
                  className="pl-2 pt-2"
                  label="descripton"
                  id="DESCRIPTION"
                  name="DESCRIPTION"
                  rows="4"
                  placeholder="Descripton"
                  value={selectedRow.DESCRIPTION}
                  onChange={onChange}
                />
                  {getFirstError('Description') && (
                                    <div className="text-red-500 text-sm mt-1">{getFirstError('Description')}</div>
                                )}
                  {errors.DESCRIPTIONLENGTH && (
                                    <div className="text-red-500 text-sm mt-1">{errors.DESCRIPTIONLENGTH}</div>
                                )}
                                {errors.DESCRIPTIONCHARS && (
                                    <div className="text-red-500 text-sm mt-1">{errors.DESCRIPTIONCHARS}</div>
                                )} 
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="file"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  File:
                  <a
                  target="_blank"
                   rel="noopener noreferrer"
                   className="text-blue-500 hover:underline"
                  > 
                  <button type="button" onClick={() => {
                  handleViewFile(selectedRow)} } className="">View File</button> 
                  </a>
                </label>
                <button
                  type="button"
                  className="bg-palette-5 rounded-md text-white hover:bg-blue-300 hover:text-blue-950 p-5 mr-5 transition-colors duration-300"
                  onClick={handleButtonClick}
                >
                  Select File...
                </button>
                
                <input
                  type="file"
                  name="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                  {getFirstError('File') && (
                                    <div className="text-red-500 text-sm mt-1">{getFirstError('File')}</div>
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

export default CertificateList;
