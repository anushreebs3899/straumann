
import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { format } from 'date-fns';
import Avatar from 'react-avatar';
import usePatientData from './usePatientData';
import './PatientHistoryGraph.css';

const PatientHistory = () => {
  const [ageRange, setAgeRange] = useState([0, 100]);
  const [sortOrder, setSortOrder] = useState({
    id: 'asc',
    name: 'asc',
    gender: 'asc',
    birthDate: 'asc',
    address: 'asc',
    phone: 'asc',
  });
  const { patientData, setPatientData } = usePatientData();

  const handleAgeChange = (value) => {
    setAgeRange(value);
  };

  const handleSort = (column) => {
    const order = sortOrder[column] === 'asc' ? 'desc' : 'asc';
    setSortOrder({ ...sortOrder, [column]: order });
    sortPatientData(column, order);
  };

  // const sortPatientData = (column, order) => {
  //   const sortedData = [...patientData].sort((a, b) => {
  //     const valueA = getColumnValue(a.resource, column);
  //     const valueB = getColumnValue(b.resource, column);

  //     if (valueA < valueB) {
  //       return order === 'asc' ? -1 : 1;
  //     }
  //     if (valueA > valueB) {
  //       return order === 'asc' ? 1 : -1;
  //     }
  //     return 0;
  //   });

  //   setPatientData(sortedData);
  // };

  // const getColumnValue = (resource, column) => {
  //   switch (column) {
  //     case 'id':
  //       return resource.id;
  //     case 'name':
  //       const familyName = resource.name?.[0]?.family || '';
  //       const givenName = resource.name?.[0]?.given?.[0] || '';
  //       return `${givenName} ${familyName}`;
  //     case 'gender':
  //       return resource.gender;
  //     case 'birthDate':
  //       return new Date(resource.birthDate);
  //     case 'address':
  //       return resource.address?.[0]?.text || '';
  //     case 'phone':
  //       return resource.telecom?.[0]?.value || '';
  //     default:
  //       return '';
  //   }
  // };
  // const sortPatientData = (column, order) => {
  //   const sortedData = [...patientData].sort((a, b) => {
  //     const valueA = getColumnValue(a.resource, column);
  //     const valueB = getColumnValue(b.resource, column);
  
  //     console.log('Sorting:', valueA, valueB); // Add this line for debugging
  
  //     if (valueA < valueB) {
  //       return order === 'asc' ? -1 : 1;
  //     }
  //     if (valueA > valueB) {
  //       return order === 'asc' ? 1 : -1;
  //     }
  //     return 0;
  //   });
  
  //   setPatientData(sortedData);
  // };
  const sortPatientData = (column, order) => {
    const sortedData = [...patientData].sort((a, b) => {
      const valueA = getColumnValue(a.resource, column);
      const valueB = getColumnValue(b.resource, column);
      console.log('Sorting:', valueA, valueB); 
      if (valueA === null) return 1;
      if (valueB === null) return -1;
      if (column === 'gender') {
        if (valueA && valueB) {
          return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
          return valueA ? -1 : 1;
        }
      }
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }
  
      return order === 'asc' ? valueA - valueB : valueB - valueA;
    });
  
    setPatientData(sortedData);
  };
  
  
  
  const getColumnValue = (resource, column) => {
    switch (column) {
      case 'id':
        return resource.id;
      case 'name':
        const familyName = resource.name?.[0]?.family || '';
        const givenName = resource.name?.[0]?.given?.[0] || '';
        return `${givenName} ${familyName}`;
      case 'gender':
        return resource.gender;
      // case 'birthDate':
      //   return new Date(resource.birthDate)||'Not Specified';
      case 'birthDate':
        const birthDate = new Date(resource.birthDate);
        return isNaN(birthDate) ? null : birthDate;
      case 'address':
        if (resource.address?.[0]?.text) {
          return resource.address[0].text;
        } else if (
          resource.address?.[0]?.line ||
          resource.address?.[0]?.city ||
          resource.address?.[0]?.state ||
          resource.address?.[0]?.postalCode ||
          resource.address?.[0]?.country
        ) {
          const line = resource.address?.[0]?.line?.[0] || '';
          const city = resource.address?.[0]?.city || '';
          const state = resource.address?.[0]?.state || '';
          const postalCode = resource.address?.[0]?.postalCode || '';
          const country = resource.address?.[0]?.country || '';
          return `${line}, ${city}, ${state} ${postalCode}, ${country}`;
        } else {
          return null;
        }
      case 'phone':
        if (resource.telecom?.[0]?.value) {
          return resource.telecom[0].value;
        } else if (resource.telecom?.[1]?.value) {
          return resource.telecom[1].value;
        } else {
          return null;
        }
      default:
        return '';
    }
  };
  

  const filteredPatientData = patientData.filter((entry) => {
    if (ageRange[0] === 0 && ageRange[1] === 100) {
      return true;
    }
    const birthDate = new Date(entry.resource.birthDate);
    const currentDate = new Date();
    const calculatedAge = currentDate.getFullYear() - birthDate.getFullYear();
    return calculatedAge >= ageRange[0] && calculatedAge <= ageRange[1];
  });

  return (
    <div className="patient-history-graph">
      <h2 className="graph-header">Patient Information Table</h2>
      <div className="filter-section">
        <div className="filter-label">Filter by Age:</div>
        <div className="slider-container">
          <Slider
            id="age-slider"
            min={0}
            max={100}
            range
            value={ageRange}
            onChange={handleAgeChange}
          />
          <div className="age-range">
            {ageRange[0]} - {ageRange[1]}
          </div>
        </div>
      </div>
      <div className="table-box">
        <table className="patient-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>Id {sortOrder.id === 'asc' ? '↑' : '↓'}</th>
              <th onClick={() => handleSort('name')}>
                Name {sortOrder.name === 'asc' ? '↑' : '↓'}
              </th>
              <th onClick={() => handleSort('gender')}>
                Gender {sortOrder.gender === 'asc' ? '↑' : '↓'}
              </th>
              <th onClick={() => handleSort('birthDate')}>
                BirthDate {sortOrder.birthDate === 'asc' ? '↑' : '↓'}
              </th>
              <th onClick={() => handleSort('address')}>
                Address {sortOrder.address === 'asc' ? '↑' : '↓'}
              </th>
              <th onClick={() => handleSort('phone')}>
                Phone {sortOrder.phone === 'asc' ? '↑' : '↓'}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPatientData.length > 0 ? (
              filteredPatientData.map((entry) => {
                const patient = entry.resource;
                const familyName = patient.name?.[0]?.family || '';
                const givenName = patient.name?.[0]?.given?.[0] || '';
                const fullName = `${givenName} ${familyName}`;
                const avatarName = `${givenName.charAt(0)}${familyName.charAt(0)}`;

                let formattedBirthDate = '';
                if (patient.birthDate && !isNaN(new Date(patient.birthDate))) {
                  formattedBirthDate = format(new Date(patient.birthDate), 'dd/MMM/yyyy');
                } else {
                  formattedBirthDate = 'Not Specified';
                }

                let address = 'Not specified';
                if (patient.address?.[0]?.text) {
                  address = patient.address[0].text;
                } else if (
                  patient.address?.[0]?.line ||
                  patient.address?.[0]?.city ||
                  patient.address?.[0]?.state ||
                  patient.address?.[0]?.postalCode ||
                  patient.address?.[0]?.country
                ) {
                  const line = patient.address?.[0]?.line?.[0] || '';
                  const city = patient.address?.[0]?.city || '';
                  const state = patient.address?.[0]?.state || '';
                  const postalCode = patient.address?.[0]?.postalCode || '';
                  const country = patient.address?.[0]?.country || '';
                  address = `${line}, ${city}, ${state} ${postalCode}, ${country}`;
                }

                let phoneNumber = 'Not specified';
                if (patient.telecom?.[0]?.value) {
                  phoneNumber = patient.telecom[0].value;
                } else if (patient.telecom?.[1]?.value) {
                  phoneNumber = patient.telecom[1].value;
                }

                return (
                  <tr key={patient.id}>
                    <td>{patient.id}</td>
                    <td>
                      <Avatar
                        name={avatarName}
                        size="20"
                        round
                        className="avatar"
                      />
                      {fullName}
                    </td>
                    <td>{patient.gender}</td>
                    <td>{formattedBirthDate}</td>
                    <td>{address}</td>
                    <td>{phoneNumber}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="no-data-row">No patient data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientHistory;
