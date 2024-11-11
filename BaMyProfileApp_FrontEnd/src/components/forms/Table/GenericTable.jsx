import React, { useEffect, useState } from 'react';
import "../../../assets/styles/genericTable.scss"

const GenericTable = ({ data }) => {
  
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      // Apiden gelen datanın Property Namelerini alıyor
      const flatObject = flattenObject(data[0]);

      const keys = Object.keys(flatObject);
      
      //
      const orderedKeys = [];
      if (keys.includes("name")) orderedKeys.push("name");
      if (keys.includes("lastname")) orderedKeys.push("lastname");
      if (keys.includes("username")) orderedKeys.push("username");

      keys.forEach(key => {
        if (!orderedKeys.includes(key)) {
          orderedKeys.push(key);
        }
      });

      setColumns(orderedKeys);
    }
  }, [data]);

  //iç içe olan Arraylerin düzleştiriliyor
  const flattenObject = (obj, parent = '', res = {}) => {

    for (let key in obj) {
      
      const propName = parent ? parent + ' ' + key : key;//iç içe olan elemanlar varsa aralarına boşluk koyarak yazdırmayı sağlıyor
      const propNameUp = propName.toLocaleUpperCase(); // oluşan propnameleri upperCase yapmamızı sağlıyor

      if (typeof obj[key] == 'object') {

        flattenObject(obj[key], propNameUp, res);
      } 
      else {
      
        res[propNameUp] = obj[key];

      }
    }
    return res;
  };

  const flattenData = data.map(item => flattenObject(item));

  if (!data || data.length === 0) {
    return <p>Veri bulunamadı.</p>;
  }

  return (
    <div className="generic-table-container">
      <table className="generic-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {flattenData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={column}>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GenericTable;
