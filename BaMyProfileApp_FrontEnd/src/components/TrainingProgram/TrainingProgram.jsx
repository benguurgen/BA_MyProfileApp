import React, { useState, useCallback, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal, Textarea, TextInput } from "flowbite-react";
import FlowbiteGenericTable from "../Tables/FlowbiteGenericTable";
import { Api } from "../api/Api";
import { debounce } from "lodash";
import { useQuery, useMutation, useQueryClient } from 'react-query';
 
const TrainingProgram = () => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [errors, setErrors] = useState({});
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({
    NAME: "",
    TIMEINHOURS: null,
    CONTENT: "",
  });
 
  const [data, setData] = useState([
    { name: "BOOST", TimeInHours: "660", content: ".Net" },
    { name: "BOOST", TimeInHours: "330", content: "React" },
  ]);
 
  const { refetch: getAllTrainingPrograms } = useQuery("trainingPrograms", async () => {
    const response = await Api.handleRequestGetAsync(
      "https://localhost:7052/api/TrainingProgram/GetAll"
    );
    setData(response.data.data);
  });

  useEffect(() => {
    getAllTrainingPrograms();
  }, [getAllTrainingPrograms]);
 
  
  const createMutation = useMutation(
    async (newProgram) => {
    const response = await Api.handleRequestPostAsync(
      "https://localhost:7052/api/TrainingProgram/Create",
      newProgram);
      return response.data;
  }, 
  {
    onSuccess: () => {
      getAllTrainingPrograms();
      handleCloseAddModal();
    },
    onError: (error) => {
      if (error.data.errors && Object.keys(error.data.errors).length > 0) {
        setErrors(error.data.errors);
      } else {
        setErrors({});
      }
    }
  });

  const updateMutation = useMutation
  (async (updatedProgram) => {
    const response = await Api.handleRequestPutAsync(
      "https://localhost:7052/api/TrainingProgram/Update",
      updatedProgram);
      return response.data;
  }, {
    onSuccess: () => {
      getAllTrainingPrograms();
      handleCloseUpdateModal();
    },
    onError: (error) => {
      if (error.data.errors && Object.keys(error.data.errors).length > 0) {
        setErrors(error.data.errors);
      } else {
        setErrors({});
      }
    }
  });
 
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.NAME.value;
    const timeInHours = parseInt(e.target.TIMEINHOURS.value);
    const content = e.target.CONTENT.value;
    
    
    let response;  
    console.log("Gönderilen veri:", { name, timeInHours, content }); 
  
    const validationData = {
      name: name,
      timeInHours: timeInHours,
      content: content,
    };
  
    
    response = await debouncedCreateProgramData(validationData);
    console.log("Validation response:", response); 
  
    
    if (!response || response.status !== 200) {
      console.error("Validation failed:", errors);
      return; 
    } else {
      createMutation.mutate({
        name: name,
        timeInHours: timeInHours,
        content: content,
      });
    }

    // console.log("Gönderilen Veri:", { name, timeInHours, content });
  };

  
  
  
 
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      return;
    }
    const name = e.target.NAME.value;
    const timeInHours = parseInt(e.target.TIMEINHOURS.value);
    const content = e.target.CONTENT.value;
    updateMutation.mutate({
      id: selectedRow.ID,
      name: name,
      timeInHours: timeInHours,
      content: content,
    });
  };
 
  const handleDeleteSubmit = async () => {
    try {
      await Api.handleRequestDeleteAsync(
        "https://localhost:7052/api/TrainingProgram/Delete",
        selectedRow.ID
      );
      await getAllTrainingPrograms();
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  const debouncedUpdateProgramData = useCallback(
    debounce(async (updatedData) => {
      // console.log("Gönderilen Veri:", updatedData); 
  
      try {
        const response = await Api.handleRequestPutAsync(
          "https://localhost:7052/api/TrainingProgram/ValidateUpdate",
          updatedData
        );
  
        if (response.status === 200) {
          setErrors({});
        } else {
          setErrors(response.data.errors);
        }
      } catch (error) {
        console.error("API doğrulama hatası:", error);
        if (error.response && error.response.data && typeof error.response.data.errors === 'object') {
          const apiErrors = {};
          Object.entries(error.response.data.errors).forEach(([key, value]) => {
            apiErrors[key] = Array.isArray(value) ? value[0] : value;
          });
          setErrors(apiErrors);
        }
      }
    }, 500),
    []
  );
  const debouncedCreateProgramData = useCallback(
    debounce(async (createdData) => {
  
      try {
        const response = await Api.handleRequestPostAsync(
          "https://localhost:7052/api/TrainingProgram/ValidateCreate",
          createdData
        );
  
        if (response.status === 200) {
          setErrors({});
        } else {
            setErrors(response.data.errors || {});
            console.log(response.errors);
        }
        return response;
      } catch (error) {
        console.error("API doğrulama hatası:", error);
        if (error.response && error.response.data && typeof error.response.data.errors === 'object') {
          const apiErrors = {};
          Object.entries(error.response.data.errors).forEach(([key, value]) => {
            apiErrors[key] = Array.isArray(value) ? value[0] : value;
          });
          setErrors(apiErrors);
          console.log(apiErrors);
        }
        return null;
      }
    }, 500),
    []
  );
 
  const onChange = (e) => {
    const { id, value } = e.target;
    const trimmedValue = value.trimLeft(); 
    if (id === "TIMEINHOURS") {
      const isValidNumber = /^[0-9]*$/.test(trimmedValue);
      if (!isValidNumber) {
        return; 
      }
    }
 
    const finalValue = id === "TIMEINHOURS" && trimmedValue === "" ? null : trimmedValue;
  
    setSelectedRow((prevState) => ({
      ...prevState,
      [id]: finalValue,
    }));
  
    if (trimmedValue !== "") {
      let errorKey = id === "TIMEINHOURS" ? "TimeInHours" : id === "NAME" ? "Name" : "Content";
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[errorKey]; 
        return updatedErrors;
      });
    }
  
    if (isUpdate) {
      debouncedUpdateProgramData({ ...selectedRow, [id]: finalValue });
    } else {
      debouncedCreateProgramData({ ...selectedRow, [id]: finalValue });
    }
  };
  
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setErrors({});
    setSelectedRow({
      NAME: "",
      TIMEINHOURS: "",
      CONTENT: "",
    });
  };
 
  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setErrors({});
    setSelectedRow({
      NAME: "",
      TIMEINHOURS: "",
      CONTENT: "",
    });
  };
 
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setErrors({});
    setSelectedRow({
      NAME: "",
      TIMEINHOURS: "",
      CONTENT: "",
    });
  };
 
  const renderForm = () => (
    <div className="grid gap-4 mb-4 grid-cols-2">
      <div className="col-span-2">
        <label
          htmlFor="NAME"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Program Name
        </label>
        <TextInput
          id="NAME"
          name="NAME"
          type="text"
          placeholder="Program Name..."
          value={selectedRow.NAME}
          onChange={(e) => onChange(e, isUpdate)}
        />
        {errors.Name && <div style={{ color: "red" }}>{errors.Name[0]}</div>}
      </div>
      <div className="col-span-2">
        <label
          htmlFor="TIMEINHOURS"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Program Duration
        </label>
        <TextInput
          id="TIMEINHOURS"
          name="TIMEINHOURS"
          type="text"
          placeholder="Program Duration..."
          value={selectedRow.TIMEINHOURS === null ? "" : selectedRow.TIMEINHOURS}
          onChange={(e) => onChange(e, isUpdate)}
        />
        {errors.TimeInHours && (
          <div style={{ color: "red" }}>{errors.TimeInHours[0]}</div>
        )}
      </div>
      <div className="col-span-2">
        <label
          htmlFor="CONTENT"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Program Content
        </label>
        <Textarea
          id="CONTENT"
          name="CONTENT"
          rows="4"
          placeholder="Program Content..."
          value={selectedRow.CONTENT}
          onChange={(e) => onChange(e, isUpdate)}
        />
        {errors.Content && <div style={{ color: "red" }}>{errors.Content[0]}</div>}
      </div>
    </div>
  );
 
  return (
    <>
      <FlowbiteGenericTable
        data={data}
        colSize={4}
        setOpenAddModal={() => {
          setSelectedRow({
            NAME: "",
            TIMEINHOURS: null,
            CONTENT: "",
          });
          setIsUpdate(false); 
          setOpenAddModal(true);
        }}
        setOpenUpdateModal={(row) => {
          setIsUpdate(true); 
          setSelectedRow(row);
          setOpenUpdateModal(true);
        }}
        setOpenDeleteModal={(row) => {
          setSelectedRow(row);
          setOpenDeleteModal(true);
        }}
        setSelectedRow={setSelectedRow}
        pageName={'Training Program'}
      />
 
      <Modal show={openAddModal} size="md" popup onClose={handleCloseAddModal}>
        <Modal.Header>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            Create New Training Program
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleCreateSubmit} className="p-4 md:p-5">
            {renderForm()}
            <div className="flex justify-end">
              <Button
                type="submit"
                size="md"
                className="text-white inline-flex items-center bg-palette-5 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2.5 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                  />
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
        onClose={handleCloseUpdateModal}
      >
        <Modal.Header>
          <div className="pt-3 text-lg font-semibold text-gray-900 dark:text-white">
            UPDATE
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdateSubmit}>
            {renderForm()}
            <div className="flex justify-end">
              <Button
                type="submit"
                size="md"
                className="text-white bg-palette-5 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                UPDATE
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
 
export default TrainingProgram;