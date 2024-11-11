import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Select, TextInput } from "flowbite-react";
import FlowbiteGenericTable from "../Tables/FlowbiteGenericTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { Api } from "../api/Api";

// Mapping of position numbers to names
const positionMap = {
  1: "Intern",
  2: "In Training",
  3: "Working",
  4: "Graduate",
  5: "Seeking Employment",
  6: "Other",
};

  

const Student = () => {
  const [errors, setErrors] = useState({});
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [data, setData] = useState([]);
  const [dataForTable, setDataForTable] = useState([]);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [isDetailed, setisDetailed] = useState(true);

  useEffect(() => {
    getAllStudents();
  }, []);

  const getFirstError = (fieldName) => {
    if (errors[fieldName]) {
      return Array.isArray(errors[fieldName])
        ? errors[fieldName][0]
        : errors[fieldName];

    }
    return null;
  };


  const formatDateToDateFns = (date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm:ss");
  };

  const getAllStudents = async () => {
    try {
      const response = await Api.handleRequestGetAsync(
        "https://localhost:7052/api/Student/GetAll"
      );
      if (response.status === 200) {
        const updatedData = response.data.data.map((s) => ({
          ...s,
          image: s.image ? `data:image/jpeg;base64,${s.image}` : null, // Convert Base64 to image URL
          isCandidate:s.isCandidate
        }));
        setData(updatedData);
        const updatedDataTable = response.data.data.map((s) => ({   
          fullname: s.firstName +" "+ s.lastName,
          mail:s.email,
          isCandidate:s.isCandidate?"Yes":"No",
          id: s.id
        }));
        setDataForTable(updatedDataTable);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleViewImage = () => {
    if (!selectedRow.IMAGE) return;
    else{
     
        // Base64 verisinden Blob oluşturma
        const byteCharacters = atob(selectedRow.IMAGE.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
    
        // Blob'dan URL oluşturma
        const blobUrl = URL.createObjectURL(blob);
    
        // Yeni bir sekme açma
        window.open(blobUrl, '_blank');
      }
    };
 

  const onChange = (e) => {
    e.target.value = e.target.value.trimLeft();
    const { name, value } = e.target;
    
    setSelectedRow({ ...selectedRow, [name.toLocaleUpperCase()]: value });
  };

  const onDateChange = (date) => {
    setDateOfBirth(date);
    setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
  };

  const handleButtonClick = () => {
    setErrors((prev) => ({ ...prev, FILENAME: "" }));
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === "image/jpeg" || selectedFile.type === "image/png")
    ) {
      setFile(selectedFile);
      setErrors((prev) => ({ ...prev, FILE: "" }));
      setFileName(selectedFile.name);
    } else {
      setErrors((prev) => ({
        ...prev,
        FILE: "File should be JPEG or PNG",
      }));
      setFile(null);
      setFileName("");
    }
  };

  
  
  const onClose = (method) => {
    setErrors({});
    setFile(null);
    setFileName("");
    setDateOfBirth(new Date().toISOString().split("T")[0]);
    method(false);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    const firstName = e.target[0].value;
    const lastName = e.target[1].value;
    const email = e.target[3].value;
    const phoneNumber = e.target[4].value;
    const gender = e.target[5].value === "male"? true:false;
    console.log(e.target[5].value);
    console.log(gender);
    const address = e.target[6].value;
    const currentPosition = e.target[7].value;
    const isCandidate = e.target[10].value;

   

    const formData = new FormData();
    formData.append("FirstName", firstName);
    formData.append("LastName", lastName);
    formData.append("DateOfBirth", formatDateToDateFns(dateOfBirth));
    formData.append("Email", email);
    formData.append("PhoneNumber", phoneNumber);
    formData.append("Gender", gender);
    formData.append("Address", address);
    formData.append("CurrentPosition", currentPosition);
    formData.append("IsCandidate", isCandidate);
    formData.append("Image", file);

    try {
      const response = await Api.handleRequestPostAsync(
        "https://localhost:7052/api/Student/Create",
        formData,
        false
      );
      if (response.status === 200) {
        await getAllStudents();
        setOpenAddModal(false);
      } else {
        if (response.data.errors) {
          setErrors(response.data.errors);
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const firstName = e.target[0].value;
    const lastName = e.target[1].value;
    const email = e.target[3].value;
    const phoneNumber = e.target[4].value;
    const gender = e.target[5].value === "true";
    const address = e.target[6].value;
    const currentPosition = e.target[7].value;
    const isCandidate = selectedRow.ISCANDIDATE;

    
    
    const formData = new FormData();
    formData.append("id", selectedRow.ID);
    formData.append("FirstName", firstName);
    formData.append("LastName", lastName);
    formData.append(
      "DateOfBirth",
      selectedRow.DATEOFBIRTH
        ? formatDateToDateFns(selectedRow.DATEOFBIRTH)
        : null
    );
    formData.append("Email", email);
    formData.append("PhoneNumber", phoneNumber);
    formData.append("Gender", gender);
    formData.append("Address", address);
    formData.append("CurrentPosition", currentPosition);
    formData.append("IsCandidate", isCandidate);
    console.log(data)
    console.log(dataForTable)
    if (file) {
      formData.append("Image", file);
    }

    

    try {
      const response = await Api.handleRequestPutAsync(
        "https://localhost:7052/api/Student/Update",
        formData
      );
      if (response.status === 200) {
        await getAllStudents();
        setOpenUpdateModal(false);
      } else {
        setErrors(response.errors || {});
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();

    try {
      await Api.handleRequestDeleteAsync(
        "https://localhost:7052/api/Student/Delete",
        selectedRow.ID
      ).then(async () => {
        setDataForTable(d=>d.filter(item=>item.id!==selectedRow.ID))
        setData(d=>d.filter(item=>item.id!==selectedRow.ID))
        getAllStudents();
      });
      setOpenDeleteModal(false);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  useEffect(() => {
    if (openUpdateModal || openAddModal) {
      setErrors({});
    }
  }, [openUpdateModal, openAddModal]);

  // `handleCloseDeleteModal` fonksiyonu ekleniyor
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setErrors({});
  };
  console.log(selectedRow)
  return (
    <>
      <FlowbiteGenericTable
        data={dataForTable}
        rowData={data}
        colSize={3}
        setOpenAddModal={setOpenAddModal}
        setOpenUpdateModal={setOpenUpdateModal}
        setOpenDeleteModal={setOpenDeleteModal}
        setOpenDetailsModal={setOpenDetailsModal}
        setSelectedRow={setSelectedRow}
        handleViewImage={handleViewImage}
        selectedRow={selectedRow}
        isDetailed = {isDetailed}
        pageName = {'Student'}   
      />
      <Modal
        show={openAddModal}
        size="md"
        popup
        onClose={() => onClose(setOpenAddModal)}
      >
        <Modal.Header>
          <div className="text-lg font-semibold text-gray-900 dark:text-white pl-2">
            Create New Student
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleCreateSubmit} className="p-4 md:p-5">
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label
                  htmlFor="firstName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  First Name
                </label>
                <TextInput
                  label="firstName"
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  onChange={onChange}
                />
                {getFirstError('FirstName') && (
                  <div className="text-red-600 text-sm mt-1">{getFirstError('FirstName')}</div>
                  )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="lastName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Last Name
                </label>
                <TextInput
                  label="lastName"
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  onChange={onChange}
                />
                 {getFirstError('LastName') && (
                  <div className="text-red-600 text-sm mt-1">{getFirstError('LastName')}</div>
                  )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="dateOfBirth"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Date of Birth
                </label>
                <DatePicker
                  name="dateOfBirth"
                  selected={dateOfBirth}
                  onChange={onDateChange}
                  dateFormat="yyyy-MM-dd"
                  className="p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                />
                 {getFirstError('DateOfBirth') && (
                  <div className="text-red-600 text-sm mt-1">{getFirstError('DateOfBirth')}</div>
                  )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <TextInput
                  label="email"
                  id="email"
                  name="email"
                  type="text"
                  placeholder="Email"
                  onChange={onChange}
                  onKeyPress={(e) => {
                    if (e.target.value.length === 0 && e.key === ' ') {
                      e.preventDefault();
                    }
                  }}
                />
                {getFirstError('Email') && (
                  <div className="text-red-600 text-sm mt-1">{getFirstError('Email')}</div>
                  )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="phoneNumber"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Phone Number
                </label>
                <TextInput
                  label="phoneNumber"
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  placeholder="Phone Number"
                  onChange={onChange}
                />
                {getFirstError('PhoneNumber') && (
                  <div className="text-red-600 text-sm mt-1">{getFirstError('PhoneNumber')}</div>
                  )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="gender"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Gender
                </label>
                <Select
                  id="gender"
                  name="gender"
                  onChange={onChange}
                  value={selectedRow.gender}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="address"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Address
                </label>
                <TextInput
                  label="address"
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Address"
                  onChange={onChange}
                />
                 {getFirstError('Address') && (
                  <div className="text-red-600 text-sm mt-1">{getFirstError('Address')}</div>
                  )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="currentPosition"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Current Position
                </label>
                <Select
                  id="currentPosition"
                  name="currentPosition"
                  onChange={onChange}
                >
                  <option value="1">Intern</option>
                  <option value="2">In Training</option>
                  <option value="3">Working</option>
                  <option value="4">Graduate</option>
                  <option value="5">Seeking Employment</option>
                  <option value="6">Other</option>
                </Select>
                {getFirstError('CurrentPosition') && (
                  <div className="text-red-600 text-sm mt-1">{getFirstError('CurrentPosition')}</div>
                  )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="file"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Image
                </label>
                <button
                  type="button"
                  className="bg-palette-5 rounded-md text-white hover:bg-blue-300 hover:text-blue-950 p-5 mr-5 transition-colors duration-300"
                  onClick={handleButtonClick}
                >
                  Select Image...
                </button>
                <label>{fileName}</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                {errors.FILE && (
                  <div style={{ color: "red" }}>{errors.FILE}</div>
                )}
                {errors.FILENAME && (
                  <div style={{ color: "red" }}>{errors.FILENAME}</div>
                )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="isCandidate"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Is Candidate
                </label>
                <Select
                  id="isCandidate"
                  name="isCandidate"
                  onChange={onChange}
                  value={selectedRow.ISCANDIDATE}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
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

      {/* UPDATEMODAL */}
      <Modal
        show={openUpdateModal}
        size="md"
        popup
        onClose={() => onClose(setOpenUpdateModal)}
      >
        <Modal.Header>
          <div className="text-lg font-semibold text-gray-900 dark:text-white pl-2">
            Update Student
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdateSubmit} className="p-4 md:p-5">
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label
                  htmlFor="firstName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  First Name
                </label>
                <TextInput
                  label="firstName"
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={selectedRow.FIRSTNAME}
                  onChange={onChange}
                />
                {getFirstError('FirstName') && (
                  <div className="text-red-600 text-sm mt-1">{getFirstError('FirstName')}</div>
                  )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="lastName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Last Name
                </label>
                <TextInput
                  label="lastName"
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={selectedRow.LASTNAME}
                  // placeholder="Last Name"
                  onChange={onChange}
                />
                {getFirstError('LastName') && (
                  <div className="text-red-600 text-sm mt-1">{getFirstError('LastName')}</div>
                  )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="dateOfBirth"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Date of Birth
                </label>

                <DatePicker
                  selected={
                    selectedRow.DATEOFBIRTH
                      ? new Date(selectedRow.DATEOFBIRTH)
                      : null
                  }
                  onChange={(date) => {
                    setSelectedRow({ ...selectedRow, DATEOFBIRTH: date });
                    if (!date) {
                      setErrors((prev) => ({ ...prev, dateOfBirth: 'Enter a valid date of birth' }));
                    } else {
                      setErrors((prev) => ({ ...prev, dateOfBirth: '' }));
                    }
                  }}
                  dateFormat="yyyy-MM-dd"
                  className="p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                />

                {getFirstError('DateOfBirth') && (
                  <div className="text-red-600 text-sm mt-1">{getFirstError('DateOfBirth')}</div>
                  )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                
                <div>
                <TextInput
                  label="Email"
                  id="email"
                  name="email"
                  type="text"
                  value={selectedRow.EMAIL}
                  placeholder="Email"
                  onChange={(e) => {
                    const { value } = e.target;
                    setSelectedRow({ ...selectedRow, EMAIL: value });

                   
                  }}
                />
                {getFirstError('Email') && (
                  <div className="text-red-600 text-sm mt-1">{getFirstError('Email')}</div>
                  )}
                </div>



              </div>
              
              <div className="col-span-2">
                <label
                  htmlFor="phoneNumber"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Phone Number
                </label>
                <TextInput
                  label="phoneNumber"
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  value={selectedRow.PHONENUMBER}
                  placeholder="Phone Number"
                  onChange={(e) => {
                    const { value } = e.target;
                    setSelectedRow({ ...selectedRow, PHONENUMBER: value });
                    const phonePattern = /^[0-9]{10}$/; 
                    if (!value.match(phonePattern)) {
                      setErrors((prev) => ({ ...prev, phoneNumber: 'Phone number must start with 0 and must be 11 digits long.' }));
                    } else {
                      setErrors((prev) => ({ ...prev, phoneNumber: '' }));
                    }
                  }}
                />
                {getFirstError('PhoneNumber') && (
                  <div className="text-red-600 text-sm mt-1">{getFirstError('PhoneNumber')}</div>
                  )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="gender"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Gender
                </label>
                <Select
                  id="gender"
                  name="gender"
                  value={selectedRow.GENDER}
                  onChange={onChange}
                >
                  <option value={true}>Male</option>
                  <option value={false}>Female</option>
                </Select>
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="address"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Address
                </label>
                <TextInput
                  label="address"
                  id="address"
                  name="address"
                  type="text"
                  value={selectedRow.ADDRESS}
                  placeholder="Address"
                  onChange={onChange}
                />
                {getFirstError('Address') && (
                  <div className="text-red-600 text-sm mt-1">{getFirstError('Address')}</div>
                  )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="currentPosition"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Current Position
                </label>
                <Select
                  id="currentPosition"
                  name="currentPosition"
                  value={selectedRow.CURRENTPOSITION}
                  onChange={onChange}
                >
                  <option value="1">Intern</option>
                  <option value="2">In Training</option>
                  <option value="3">Working</option>
                  <option value="4">Graduate</option>
                  <option value="5">Seeking Employment</option>
                  <option value="6">Other</option>
                </Select>
                {getFirstError('CurrentPosition') && (
                  <div className="text-red-600 text-sm mt-1">{getFirstError('CurrentPosition')}</div>
                  )} 
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="file"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Image:<img 
                 src={selectedRow.IMAGE} 
                 alt="table image" 
                 className="h-16 w-16 object-cover " 
                />
                  {selectedRow.IMAGE && (
                    <button
                      type="button"
                      onClick={() => handleViewImage()}
                      className="text-blue-500 hover:underline"
                    >
                      View Image
                    </button>
                  )}
                </label>
                <button
                  type="button"
                  className="bg-palette-5 rounded-md text-white hover:bg-blue-300 hover:text-blue-950 p-5 mr-5 transition-colors duration-300"
                  onClick={handleButtonClick}
                >
                  Select Image...
                </button>
                <label>{fileName}</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                {errors.FILE && (
                  <div style={{ color: "red" }}>
                    {errors.FILE + ". Previous file will remain unchanged."}
                  </div>
                )}
                {errors.FILENAME && (
                  <div style={{ color: "red" }}>{errors.FILENAME}</div>
                )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="isCandidate"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Is Candidate
                </label>
                <Select
                  id="isCandidate"
                  name="isCandidate"
                  value={selectedRow.ISCANDIDATE}
                  onChange={(e) => onChange(e)}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
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

      {/* DETAILS MODAL */} 
       <Modal
        show={openDetailsModal}
        size="md"
        popup
        onClose={() => setOpenDetailsModal(false)}
      >
        <Modal.Header>
          <div className="text-lg font-semibold text-gray-900 dark:text-white pl-2">
            Student Details
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="grid gap-4 mb-4 grid-cols-2">
          <div className="col-span-2">
              <p>
                <strong>Photo:</strong>{" "}
                <img 
                 src={selectedRow.IMAGE} 
                 alt="table image" 
                 className="h-16 w-16 object-cover" 
                />
              </p>
            </div>
            <div className="col-span-2">
              <p>
                <strong>First Name:</strong> {selectedRow.FIRSTNAME}
              </p>
            </div>
            <div className="col-span-2">
              <p>
                <strong>Last Name:</strong> {selectedRow.LASTNAME}
              </p>
            </div>
            <div className="col-span-2">
              <p>
                <strong>Date of Birth:</strong>{" "}
                {selectedRow.DATEOFBIRTH
                  ? format(new Date(selectedRow.DATEOFBIRTH), "yyyy-MM-dd")
                  : "N/A"}
              </p>
            </div>
            <div className="col-span-2">
              <p>
                <strong>Email:</strong> {selectedRow.EMAIL}
              </p>
            </div>
            <div className="col-span-2">
              <p>
                <strong>Phone Number:</strong>{" "}
                {selectedRow.PHONENUMBER || "N/A"}
              </p>
            </div>
            <div className="col-span-2">
              <p>
                <strong>Gender:</strong>{" "}
                {selectedRow.GENDER ? "Male" : "Female"}
              </p>
            </div>
            <div className="col-span-2">
              <p>
                <strong>Address:</strong> {selectedRow.ADDRESS || "N/A"}
              </p>
            </div>
            <div className="col-span-2">
              <p>
                <strong>Current Position:</strong>{" "}
                {positionMap[selectedRow.CURRENTPOSITION] || "N/A"}
              </p>
            </div>
            <div className="col-span-2">
              <p>
                <strong>Is Candidate:</strong>{" "}
                {selectedRow.ISCANDIDATE?"Yes":"No"}
              </p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Student;
