import React, { useState, useCallback, useEffect } from "react";
import { Button, Modal, Textarea, TextInput } from "flowbite-react";
import FlowbiteGenericTable from "../Tables/FlowbiteGenericTable";
import { Api } from "../api/Api";
import { debounce } from "lodash";
import { useQuery, useMutation, useQueryClient } from 'react-query';

const Reference = () => {
  const [errors, setErrors] = useState({});
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({
    NAME: "",
    COMPANY: "",
    ADDRESS: "",
    EMAIL: "",
    PHONENUMBER: "",
    TITLE: "",
  });

  const queryClient = useQueryClient();

  const [touchedFields, setTouchedFields] = useState({});
  
  

  // Modal  açıldığında hataları temizleyen useEffect
  useEffect(() => {
    if (openAddModal || openUpdateModal) {
      setErrors({});
      setTouchedFields({});
    }
  }, [openAddModal, openUpdateModal]);

  const { data: references, isLoading } = useQuery(
  "references",
  async () => {
    const response = await Api.handleRequestGetAsync("https://localhost:7052/api/Reference/GetAll");
    return response.data.data;
  },
  {
    staleTime: 5 * 60 * 1000, // 5 dakika boyunca cache'te kalacak
    cacheTime: 10 * 60 * 1000, // 10 dakika boyunca kullanılmazsa bellekten temizlenecek
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
      COMPANY: "",
      ADDRESS: "",
      TITLE: "",
      EMAIL: "",
      PHONENUMBER: "",
    });
    setOpenAddModal(true);
  };

  // Yeni bir referans oluşturmak için Mutation
  const createMutation = useMutation(
    async (newReference) => {
      const response = await Api.handleRequestPostAsync("https://localhost:7052/api/Reference/Create", newReference);
      return response.data;
    },
    {
      onSuccess: (response) => {
        if (response.isSuccess) {
          queryClient.invalidateQueries("references");
          setOpenAddModal(false); // Sadece başarılı olduğunda modal'ı kapatıyoruz.
        }
      },
      onError: (error) => {
        console.log("Create işlemi hatalı, hata:", error); 
        if (error.response && error.response.data) {
          console.log("Detaylı hata yanıtı:", error.response.data.errors); 
          setErrors(error.response.data.errors || {});
        }
      }
    }
  );

  const updateMutation = useMutation(
    async (updatedReference) => {
      const response = await Api.handleRequestPutAsync("https://localhost:7052/api/Reference/Update", updatedReference);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("references");
        setOpenUpdateModal(false); // Başarılı olduğunda modalı kapat
      },
      onError: (error) => {
        if (error.response && error.response.data) {
          setErrors(error.response.data.errors || {});
        }
        // Hata varsa modal açık kalacak
      }
    }
  );


  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    const newReferenceData = {
        name: e.target.NAME.value.trim(),
        company: e.target.COMPANY.value.trim(),
        title: e.target.TITLE.value.trim(),
        email: e.target.EMAIL.value.trim(),
        phoneNumber: e.target.PHONENUMBER.value.trim(),
        address: e.target.ADDRESS.value.trim(),
    };

    // Mark all fields as touched to show errors
    setTouchedFields({
        NAME: true,
        COMPANY: true,
        TITLE: true,
        EMAIL: true,
        PHONENUMBER: true,
        ADDRESS: true,
    });

  

    // API validation and mutation
    try {
        const validationResponse = await Api.handleRequestPutAsync("https://localhost:7052/api/Reference/ValidateForCreate", newReferenceData);

        if (validationResponse.status !== 200) {
            const serverErrors = validationResponse.data.errors || {};
            setErrors(serverErrors);
            return;
        }

        // Proceed to create if validation passes
        createMutation.mutate(newReferenceData);
    } catch (error) {
        console.error("Validation error:", error);
    }
};
  
  
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
  
    // Eğer validasyon hatası varsa işlemi durdur
    if (Object.keys(errors).length > 0) {
      return;
    }
  
    // Validasyon başarılıysa update işlemini başlat
    updateMutation.mutate(selectedRow);
  };
  

  // Silme işlemi
  const handleDeleteSubmit = async () => {
    try {
      await Api.handleRequestDeleteAsync("https://localhost:7052/api/Reference/Delete", selectedRow.ID);
      queryClient.invalidateQueries("references");
      setOpenDeleteModal(false);
    } catch (error) {
      console.error("Hata oluştu:", error);
    }
  };
  
  

  const debouncedUpdateReferanceData = useCallback(
    debounce(async (updatedData) => {
      console.log("Gönderilen Veri:", updatedData); // Gönderilen veriyi loglayın
    
      try {
        const response = await Api.handleRequestPutAsync(
          "https://localhost:7052/api/Reference/Validate",
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
    
    // Alan etkileşimi gerçekleştiğinde ilgili alanı touched olarak işaretle
    setTouchedFields((prev) => ({
      ...prev,
      [id]: true,
    }));
  
    // Alanın değerini güncelle
    setSelectedRow((prevState) => ({ ...prevState, [id]: trimmedValue }));
    
    // Validasyon kontrolü (debounced) çalıştır
    debouncedUpdateReferanceData({ ...selectedRow, [id]: trimmedValue });
  };

  const renderForm = () => (
    <div className="grid gap-4 mb-4 grid-cols-2">
      <div className="col-span-2">
        <label htmlFor="NAME" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Reference Name
        </label>
        <TextInput 
          id="NAME" 
          name="NAME" 
          type="text" 
          placeholder="Reference Name..." 
          value={selectedRow.NAME} 
          onChange={onChange} 
        />
        {touchedFields.NAME && getFirstError("Name") && (
          <div className="text-red-500 text-sm mt-1">{getFirstError("Name")}</div>
        )}
      </div>
  
      <div className="col-span-2">
        <label htmlFor="COMPANY" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Company
        </label>
        <TextInput 
          id="COMPANY" 
          name="COMPANY" 
          type="text" 
          placeholder="Company..." 
          value={selectedRow.COMPANY} 
          onChange={onChange} 
        />
        {touchedFields.COMPANY && getFirstError("Company") && (
          <div className="text-red-500 text-sm mt-1">{getFirstError("Company")}</div>
        )}
      </div>
  
      <div className="col-span-2">
        <label htmlFor="TITLE" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Title
        </label>
        <TextInput 
          id="TITLE" 
          name="TITLE" 
          type="text" 
          placeholder="Title..." 
          value={selectedRow.TITLE} 
          onChange={onChange} 
        />
        {touchedFields.TITLE && getFirstError("Title") && (
          <div className="text-red-500 text-sm mt-1">{getFirstError("Title")}</div>
        )}
      </div>
  
      <div className="col-span-2">
        <label htmlFor="EMAIL" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Email
        </label>
        <TextInput 
          id="EMAIL" 
          name="EMAIL" 
          type="text" 
          placeholder="Email..." 
          value={selectedRow.EMAIL} 
          onChange={onChange} 
        />
        {touchedFields.EMAIL && getFirstError("Email") && (
          <div className="text-red-500 text-sm mt-1">{getFirstError("Email")}</div>
        )}
      </div>
  
      <div className="col-span-2">
        <label htmlFor="PHONENUMBER" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Phone Number
        </label>
        <TextInput 
          id="PHONENUMBER" 
          name="PHONENUMBER" 
          type="text" 
          placeholder="Phone Number..." 
          value={selectedRow.PHONENUMBER} 
          onChange={onChange} 
        />
        {touchedFields.PHONENUMBER && getFirstError("PhoneNumber") && (
          <div className="text-red-500 text-sm mt-1">{getFirstError("PhoneNumber")}</div>
        )}
      </div>
  
      <div className="col-span-2">
        <label htmlFor="ADDRESS" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Address
        </label>
        <Textarea 
          id="ADDRESS" 
          name="ADDRESS" 
          rows="4" 
          placeholder="Address..." 
          value={selectedRow.ADDRESS} 
          onChange={onChange} 
        />
        {touchedFields.ADDRESS && getFirstError("Address") && (
          <div className="text-red-500 text-sm mt-1">{getFirstError("Address")}</div>
        )}
      </div>
    </div>
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <FlowbiteGenericTable
        data={references}
        colSize={6}
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
        pageName={'Reference'}
      />

      {/* Modals */}
      <Modal show={openAddModal} size="md" popup onClose={() => setOpenAddModal(false)}>
        <Modal.Header>Create New Reference</Modal.Header>
        
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

      <Modal show={openUpdateModal} size="md" popup onClose={() => setOpenUpdateModal(false)}>
        <Modal.Header>UPDATE</Modal.Header>
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

      <Modal show={openDeleteModal} size="md" popup onClose={() => setOpenDeleteModal(false)}>
        <Modal.Header />
        {/* <Modal.Body>
          <div className="text-center">
            <p>Are you sure you want to delete this item?</p>
            <Button onClick={handleDeleteSubmit}>Yes, I'm sure</Button>
          </div>
        </Modal.Body> */}

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

export default Reference;

