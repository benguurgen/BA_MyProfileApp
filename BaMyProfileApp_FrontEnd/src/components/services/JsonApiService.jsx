import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GenericTable from '../forms/Table/GenericTable';

const JsonApiService = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Veri çekme hatası: ', error);
      });
  }, []);

  return (
    <div>
      <GenericTable data={data}/>
    </div>
  );
};

export default JsonApiService;
