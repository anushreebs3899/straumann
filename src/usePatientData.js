import { useState, useEffect } from 'react';

const usePatientData = () => {
  const [patientData, setPatientData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://hapi.fhir.org/baseR4/Patient?_pretty=true`
        );
        const data = await response.json();
        // const filteredData = data.entry.filter(
        //   (entry) => entry.resource && entry.resource.birthDate
        // );
        setPatientData(data.entry);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    fetchData();
  }, []);

  return { patientData, setPatientData }; // Return the state and state setter
};

export default usePatientData;