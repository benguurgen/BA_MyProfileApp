import React, { useState, useCallback, useEffect } from "react";
import { Button, Modal, Textarea, TextInput } from "flowbite-react";
import FlowbiteGenericTable from "../Tables/FlowbiteGenericTable";
import { Api } from "../api/Api";
import { debounce } from "lodash";
import { useQuery, useMutation, useQueryClient } from 'react-query';
 
const Companies = () => {
  const [errors, setErrors] = useState({});
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({
    NAME: "",
    LOCATION: "",
    SECTOR: "",
    GENERALINFORMATION: "",
  });
 
  const queryClient = useQueryClient();
 
  const [touchedFields, setTouchedFields] = useState({});
  const [submitted, setSubmitted] = useState(false);
 
  useEffect(() => {
    if (openAddModal || openUpdateModal) {
      setErrors({});
      setTouchedFields({});
      setSubmitted(false);
    }
  }, [openAddModal, openUpdateModal]);
 
  const { data: companies, isLoading } = useQuery(
    "companies",
    async () => {
      const response = await Api.handleRequestGetAsync("https://localhost:7052/api/Company/Company/GetAll");
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
    setSelectedRow({
      NAME: "",
      LOCATION: "",
      SECTOR: "",
      GENERALINFORMATION: "",
    });
    setOpenAddModal(true);
  };
 
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setErrors({});
    setSelectedRow({
      NAME: "",
      SECTOR: "",
      LOCATION: "",
      GENERALINFORMATION: "",
    });
  };
 
  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setErrors({});
    setSelectedRow({
      NAME: "",
      SECTOR: "",
      LOCATION: "",
      GENERALINFORMATION: "",
    });
  };
 
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setErrors({});
    setSelectedRow({
      NAME: "",
      SECTOR: "",
      LOCATION: "",
      GENERALINFORMATION: "",
    });
  };
 
 
  const createMutation = useMutation(
    async (newCompany) => {
      const response = await Api.handleRequestPostAsync("https://localhost:7052/api/Company/Company/Create", newCompany);
      return response.data;
    },
    {
      onSuccess: (response) => {
        if (response.isSuccess) {
          queryClient.invalidateQueries("companies");
          setOpenAddModal(false); // Sadece başarılı olduğunda modal'ı kapatıyoruz.
        }
      },
      onError: (error) => {
        console.log("Create işlemi hatalı, hata:", error);
        if (error.response && error.response.data) {
          console.log("Detaylı hata yanıtı:", error.response.data);
          setErrors(error.response.data.errors || {});
        }
      }
    }
  );
 
 
  const updateMutation = useMutation(
    async (updatedCompany) => {
      const response = await Api.handleRequestPutAsync("https://localhost:7052/api/Company/Company/Update", updatedCompany);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("companies");
        setOpenUpdateModal(false);
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
 
    const newCompanyData = {
      name: e.target.NAME.value.trim(),
      location: e.target.LOCATION.value.trim(),
      sector: e.target.SECTOR.value.trim(),
      generalInformation: e.target.GENERALINFORMATION.value.trim(),
    };
 
    setSubmitted(true);
 
    console.log("Gönderilen Yeni Şirket Verisi:", newCompanyData); // Gönderilen veriyi loglayalım
 
    try {
      const validationResponse = await Api.handleRequestPutAsync(
        "https://localhost:7052/api/Company/Company/ValidateForCreate",
        newCompanyData
      );
 
      if (validationResponse.status !== 200) {
        const validationErrors = validationResponse.data.errors || {};
        setErrors(validationErrors);
        console.log("Validasyon hataları:", validationErrors); // Validasyon hatalarını loglayalım
        return; // Hata varsa işlemi durdur ve modal'ı kapatma.
      }
      
      // Eğer validasyon başarılıysa create işlemini başlat
      createMutation.mutate(newCompanyData);
    } catch (error) {
      console.error("Hata oluştu:", error);
    }
  };
 
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
 
    // Validasyon hatalarını kontrol et
    if (Object.keys(errors).length > 0) {
      return;
    }
 
    // Hata yoksa update işlemi yap
    updateMutation.mutate(
      selectedRow,
      {
        onSuccess: () => {          
          setOpenUpdateModal(false);        
        },
        onError: (error) => {
          console.error("Update işlemi sırasında hata oluştu:", error);        
        }
      }
    );
  };
 
  const handleDeleteSubmit = async () => {
    try {
      await Api.handleRequestDeleteAsync("https://localhost:7052/api/Company/Company/Delete", selectedRow.ID);
      queryClient.invalidateQueries("companies");
      setOpenDeleteModal(false);
    } catch (error) {
      console.error("Hata oluştu:", error);
    }
  };
 
  const debouncedUpdateCompanyData = useCallback(
    debounce(async (updatedData) => {
      try {
        const response = await Api.handleRequestPutAsync(
          "https://localhost:7052/api/Company/Company/Validate",
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
    }, 500),
    []
  );
 
  const onChange = (e) => {
    const { id, value } = e.target;
    const trimmedValue = value.trimLeft();
 
    // Alanın odaklandığını işaretle
    setTouchedFields((prev) => ({
      ...prev,
      [id]: true,
    }));
 
    setSelectedRow((prevState) => ({ ...prevState, [id]: trimmedValue }));
    debouncedUpdateCompanyData({ ...selectedRow, [id]: trimmedValue });
  };
 
  const renderForm = () => (
    <div className="grid gap-4 mb-4 grid-cols-2">
      <div className="col-span-2">
        <label
          htmlFor="NAME"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Company Name
        </label>
        <TextInput
          id="NAME"
          name="NAME"
          type="text"
          placeholder="Company Name..."
          value={selectedRow.NAME}
          onChange={onChange}
        />
        {getFirstError('Name') && (
          <div className="text-red-500 text-sm mt-1">{getFirstError('Name')}</div>
        )}
       
      </div>
      <div className="col-span-2">
        <label
          htmlFor="LOCATION"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Location
        </label>
        <Textarea
          id="LOCATION"
          name="LOCATION"
          type="text"
          placeholder="Location..."
          value={selectedRow.LOCATION}
          onChange={onChange}
        />
        {getFirstError('Location') && (
          <div className="text-red-500 text-sm mt-1">{getFirstError('Location')}</div>
        )}
     
      </div>
      <div className="col-span-2">
        <label
          htmlFor="SECTOR"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Sector
        </label>
        <TextInput
          id="SECTOR"
          name="SECTOR"
          type="text"
          placeholder="Sector..."
          value={selectedRow.SECTOR}
          onChange={onChange}
        />
        {getFirstError('Sector') && (
          <div className="text-red-500 text-sm mt-1">{getFirstError('Sector')}</div>
        )}
      </div>
 
      <div className="col-span-2">
        <label
          htmlFor="GENERALINFORMATION"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          General Information
        </label>
        <Textarea
          id="GENERALINFORMATION"
          name="GENERALINFORMATION"
          type="text"
          placeholder="General Information..."
          value={selectedRow.GENERALINFORMATION}
          onChange={onChange}
        />
        {getFirstError('GeneralInformation') && (
          <div className="text-red-500 text-sm mt-1">{getFirstError('GeneralInformation')}</div>
        )}
      </div>
    </div>
  );
 
  if (isLoading) return <div>Loading...</div>;
 
  return (
      <>
        <FlowbiteGenericTable
          data={companies}
          colSize={4}
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
          pageName={'Companies'}
        />
       
        <Modal show={openAddModal} size="md" popup onClose={handleCloseAddModal}>
        <Modal.Header>
        <div className="text-lg font-semibold text-gray-900 dark:text-white">
          Create New Company
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
 
export default Companies;