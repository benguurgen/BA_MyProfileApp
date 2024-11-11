import React, { useState, useCallback, useEffect } from "react";
import { Button, Modal, TextInput } from "flowbite-react";
import FlowbiteGenericTable from "../Tables/FlowbiteGenericTable";
import { Api } from "../api/Api";
import { debounce } from "lodash";
import { useQuery, useMutation, useQueryClient } from 'react-query';

const Capability = () => {
  const [errors, setErrors] = useState({});
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({ CAPABILITYNAME: "" });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (openAddModal || openUpdateModal) {
      setErrors({});
    }
  }, [openAddModal, openUpdateModal]);

  const { data: capabilities, isLoading } = useQuery(
    "capabilities",
    async () => {
      const response = await Api.handleRequestGetAsync("https://localhost:7052/api/Capability/GetAll");
      return response.data.data;
    },
    {
      staleTime: 5 * 60 * 1000, 
      cacheTime: 10 * 60 * 1000, 
    }
  );

  const getFirstError = (fieldName) => {
    if (errors[fieldName]) {
      return Array.isArray(errors[fieldName]) ? errors[fieldName][0] : errors[fieldName];
    }
    return null;
  };


  const handleOpenAddModal = () => {
    setSelectedRow({ CAPABILITYNAME: "" });
    setOpenAddModal(true);
  };

  const createMutation = useMutation(
    async (newCapability) => {
      const response = await Api.handleRequestPostAsync("https://localhost:7052/api/Capability/Create", newCapability);
      return response.data;
    },
    {
      onSuccess: (response) => {
        if (response.isSuccess) {
          queryClient.invalidateQueries("capabilities");
          setOpenAddModal(false);
        }
      },
      onError: (error) => {
        if (error.response && error.response.data) {
          setErrors(error.response.data.errors || {});
        }
      }
    }
  );
  
  const updateMutation = useMutation(
    async (updatedCapability) => {
        const response = await Api.handleRequestPutAsync("https://localhost:7052/api/Capability/Update", updatedCapability);
        return response.data;
    },
    {
        onSuccess: (response) => {
            if (response.isSuccess) {
                queryClient.invalidateQueries("capabilities");
                setOpenUpdateModal(false); // Modalı kapat
            }
        },
        onError: (error) => {
            if (error.response && error.response.data) {
                setErrors(error.response.data.errors || {});
            }
        }
    }
);
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
  
    const capabilityName = e.target.CAPABILITYNAME.value.trim();
    
    // Gönderilen veriyi loglayarak API'ye doğru veri gidip gitmediğini kontrol edelim
    console.log("Gönderilen capabilityName:", capabilityName);
    
    try {
      const validationResponse = await Api.handleRequestPutAsync(
        "https://localhost:7052/api/Capability/ValidateForCreate",
        { capabilityName }
      );
      
      console.log("Validation response:", validationResponse);
      
      if (validationResponse.status !== 200) {
        const validationErrors = validationResponse.data.errors || {};
        console.log("Validation errors:", validationErrors);
        setErrors(validationErrors);
        return;
      }
  
      // Eğer validasyon başarılıysa create işlemini başlat
      createMutation.mutate({
        capabilityName: capabilityName,
      });
  
    } catch (error) {
      console.error("Hata oluştu:", error.response ? error.response.data : error);
    }
  };
 

   

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    
    // Validasyon işlemi
    if (Object.keys(errors).length > 0) {
        return;
    }
    
    // Update işlemi
    updateMutation.mutate(selectedRow);
};
  const handleDeleteSubmit = async () => {
    try {
      await Api.handleRequestDeleteAsync(
        "https://localhost:7052/api/Capability/Delete",
        selectedRow.ID
      );
      
      // Verileri güncellemek için invalidateQueries kullanıyoruz
      queryClient.invalidateQueries("capabilities");
  
      // Modalı kapat
      setOpenDeleteModal(false);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const debouncedCapabilityData = useCallback(
    debounce(async (updatedData) => {
      try {
        const response = await Api.handleRequestPutAsync(
          "https://localhost:7052/api/Capability/Validate",
          updatedData
        );
        if (response.status === 200) {
          setErrors({});
        } else {
          const validationErrors = {};
          if (response.data.errors && typeof response.data.errors === 'object') {
            Object.entries(response.data.errors).forEach(([key, value]) => {
              validationErrors[key] = Array.isArray(value) ? value[0] : value;
            });
            setErrors(validationErrors);
          } else {
            setErrors(response.errors || {});
          }
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
    }, 300),
    []
  );
 

  // Input değiştiğinde çağrılan fonksiyon
  const onChange = (e) => {
    const { id, value } = e.target;
    const trimmedValue = value.trimLeft();
    setSelectedRow((prevState) => ({ ...prevState, [id]: trimmedValue }));
    debouncedCapabilityData({ ...selectedRow, [id]: trimmedValue });
  };

  const renderForm = () => (
    <div className="grid gap-4 mb-4 grid-cols-2">
      <div className="col-span-2">
        <label htmlFor="CAPABILITYNAME" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Capability Name
        </label>
        <TextInput id="CAPABILITYNAME" name="CAPABILITYNAME" type="text" placeholder="Capability Name..." value={selectedRow.CAPABILITYNAME} onChange={onChange} />
        {getFirstError("CapabilityName") && <div className="text-red-500 text-sm mt-1">{getFirstError("CapabilityName")}</div>}
      </div>
    </div>
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <FlowbiteGenericTable
        data={capabilities}
        colSize={2}
        setOpenAddModal={handleOpenAddModal}
        setOpenUpdateModal={(row) => {
          setSelectedRow(row);
          setOpenUpdateModal(true);
        }}
        setOpenDeleteModal={(row) => {
          setSelectedRow(row);
          setOpenDeleteModal(true);
        }}
        setSelectedRow={setSelectedRow}
        pageName={'Capability'}
      />

      {/* CREATE MODAL */}
      <Modal show={openAddModal} size="md" popup onClose={() => setOpenAddModal(false)}>
        <Modal.Header>Create New Capability</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleCreateSubmit} className="p-4 md:p-5">
            {renderForm()}
            <div className="flex justify-end">
              <Button
                type="submit"
                size="md"
                className="text-white inline-flex items-center bg-palette-5 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2.5 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Create
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* UPDATE MODAL */}
      <Modal show={openUpdateModal} size="md" popup onClose={() => setOpenUpdateModal(false)}>
        <Modal.Header>Update Capability</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdateSubmit}>
            {renderForm()}
            <div className="flex justify-end">
              <Button
                type="submit"
                size="md"
                className="text-white bg-palette-5 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Update
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* DELETE MODAL */}
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
              Are you sure you want to delete this item?
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

export default Capability;
