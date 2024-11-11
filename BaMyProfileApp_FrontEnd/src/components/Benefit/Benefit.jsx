import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import ToastService from "../services/ToastService";
import { Button, Modal, TextInput } from "flowbite-react";
import FlowbiteGenericTable from "../Tables/FlowbiteGenericTable";
import { Api } from "../api/Api";

const Benefit = () => {
  const [errors, setErrors] = useState({});
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    getAllBenefits();
  }, []);

  useEffect(() => {
    if (openAddModal || openUpdateModal) {
      setErrors({});
    }
  }, [openAddModal, openUpdateModal]);

  const getAllBenefits = async () => {
    try {
      await Api.handleRequestGetAsync(
        "https://localhost:7052/api/Benefit/GetAll"
      ).then((r) => {
        setData(r.data.data);
      });
    } catch (error) {
      ToastService.toastError("An error occurred while retrieving data.");
      console.error("Hata oluştu:", error);
    }
  };

  // const validationControl = (name) => {
  //   let validationErrors = {};

  //   if (!name || name.trim() === "") {
  //     validationErrors.NAME = "The benefit name cannot be empty.";
  //   } else if (name.length < 2 || name.length > 50) {
  //     validationErrors.NAME =
  //       "The benefit name must be at least 2 and at most 50 characters.";
  //   }

  //   setErrors(validationErrors);
  //   return Object.keys(validationErrors).length === 0;
  // };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    // const validationResult = validationControl(name);
    // if (!validationResult) return;

    try {
      const response=await Api.handleRequestPostAsync(
        "https://localhost:7052/api/Benefit/Create",
        {
          name: name
        },
        true
      );      
      if (response.status===200&& response.data && response.data.isSuccess) {
        await getAllBenefits();
        setOpenAddModal(false);
      }
      else{
        console.log("Hata yanıtı:", response.data);
        if (response.data.errors && Object.keys(response.data.errors).length > 0) {
          const firstErrorKey = Object.keys(response.data.errors)[0]; 
          const firstErrorMessage = response.data.errors[firstErrorKey][0];
          
          setErrors({ [firstErrorKey]: [firstErrorMessage] });
      }else {
        console.log("Hata mesajları yok."); // Hata yoksa bu mesajı yazdır
        setErrors({}); // Hataları temizle
      }
      e.preventDefault();
      const name = e.target[0].value;
      const validationResult = validationControl(name);
      if (!validationResult) return; // Stop if validation fails
    
    }
    } catch (error) {
      //ToastService.toastError("An error occurred while creating the benefit.");
      console.error("Hata oluştu:", error);
    }
    e.preventDefault();
    const validationResult = validationControl(name);
    if (!validationResult) return;
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    // const validationResult = validationControl(name);
    // if (!validationResult) return;

    try {
      const response=await Api.handleRequestPutAsync(
        "https://localhost:7052/api/Benefit/Update",
        {
          id: selectedRow.ID,
          name: name
        }
      );
      if (response.status===200&& response.data && response.data.isSuccess) {
        await getAllBenefits();
        setOpenUpdateModal(false);
      }
      else{
        console.log("Hata yanıtı:", response.data);
        if (response.data.errors && Object.keys(response.data.errors).length > 0) {
          const firstErrorKey = Object.keys(response.data.errors)[0]; 
          const firstErrorMessage = response.data.errors[firstErrorKey][0];
          
          setErrors({ [firstErrorKey]: [firstErrorMessage] });
      }else {
        console.log("Hata mesajları yok."); // Hata yoksa bu mesajı yazdır
        setErrors({}); // Hataları temizle
      }
      e.preventDefault();
  const name = e.target[0].value;
  const validationResult = validationControl(name);
  if (!validationResult) return;
    }

    } catch (error) {
      //ToastService.toastError("An error occurred while updating the benefit.");
      console.error("Hata oluştu:", error);
    }
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    try {
      await Api.handleRequestDeleteAsync(
        "https://localhost:7052/api/Benefit/Delete",
        selectedRow.ID
      ).then(async () => {
        await getAllBenefits();
      });
      setOpenDeleteModal(false);
    } catch (error) {
      ToastService.toastError("An error occurred while deleting the benefit.");
      console.error("Hata oluştu:", error);
    }
  };

  
  const validationControl = (name) => {
    let validationErrors = {};
  
    // Check for empty input
    if (name.trim() === "") {
      validationErrors.Name = "The capability name cannot be empty.";
    }
    // Check for input with exactly one character
    else if (name.length === 1) {
      validationErrors.Name = "The capability name must be between 2 and 256 characters long.";
    } 
    // Clear error if input is valid
    else {
      delete validationErrors.Name; 
    }
  
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const onChange = (e) => {
    const value = e.target.value.trimLeft();
    const newValue = { ...selectedRow };
    newValue[e.target.id] = value;
    setSelectedRow(newValue);
  
    // Validate the current value
    validationControl(value);
  };
  
  return (
    <>
      <div className="overflow-x-auto relative justity-between sm:rounded-lg">
        <FlowbiteGenericTable
          data={data}
          colSize={2}
          setOpenAddModal={setOpenAddModal}
          setOpenUpdateModal={setOpenUpdateModal}
          setOpenDeleteModal={setOpenDeleteModal}
          setSelectedRow={setSelectedRow}
          pageName={'Benefit'}
        />
      </div>

      <Modal
        show={openAddModal}
        size="md"
        popup
        onClose={() => setOpenAddModal(false)}
      >
        <Modal.Header>
          <div className="text-lg mt-2 ml-2 font-semibold text-gray-900 dark:text-white">
            Create New Benefit
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleCreateSubmit} className="p-4 md:p-3">
            <div className="grid gap-4 mb-3 ">
              <div className="col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Benefit Name:
                </label>
                <TextInput
                  label="name"
                  id="NAME"
                  name="NAME"
                  type="text"
                  placeholder="Benefit Name..."
                  onChange={onChange}
                />
                {errors.Name && (
                  <div style={{ color: "red" }}>{errors.Name}</div>
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
                Create
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <Modal
        show={openUpdateModal}
        size="md"
        popup
        onClose={() => setOpenUpdateModal(false)}
      >
        <Modal.Header>
          <div className="pt-4 ml-2 mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Update Benefit
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdateSubmit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-1">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Benefit Name:
                </label>
                <input
                  type="text"
                  name="NAME"
                  id="NAME"
                  value={selectedRow.NAME}
                  onChange={onChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Benefit Name..."
                />
                {errors.Name && (
                  <div style={{ color: "red" }}>{errors.Name}</div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end space-x-4">
              <Button
                type="submit"
                className="text-white bg-palette-5 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
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
        onClose={() => setOpenDeleteModal(false)}
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
              Are you sure you want to delete this benefit?
            </p>
            <div className="flex justify-center items-center space-x-4">
              <Button color="light" onClick={() => setOpenDeleteModal(false)}>
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

export default Benefit;
