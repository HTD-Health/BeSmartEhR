import { React, useEffect, useState } from "react";

const PatientDataViewer = ({ fhirClient }) => {
  const [basePatientData, setBasePatientData] = useState();
  const [patientData, setPatientData] = useState();
  const [practitionerData, setPractitionerData] = useState();

  useEffect(() => {
    getBasePatient();

    getRandomPatient();
    getPractitioner();
  }, []);

  const getBasePatient = async () => {
    try {
      const basePatientData = await fhirClient.patient.read();
      setBasePatientData(basePatientData);
    } catch (err) {
      console.log("Patient data has not been fetched properly", err);
    }
  };

  const getRandomPatient = async () => {
    try {
      const patientResponse = await fhirClient.request("Patient/12724066");
      setPatientData(patientResponse);
    } catch (error) {
      console.log("Error while fetching related Patient data", error);
    }
  };

  const getPractitioner = async () => {
    try {
      const practitionerResponse = await fhirClient.request(
        fhirClient.user.fhirUser
      );
      setPractitionerData(practitionerResponse);
    } catch (error) {
      console.log("Error while fetching related Practitioner data", error);
    }
  };

  return (
    <>
      {practitionerData && (
        <div>
          <h3>Fetched practitioner: </h3>
          <pre>{JSON.stringify(practitionerData, null, "  ")}</pre>
        </div>
      )}
      {basePatientData && (
        <div>
          <h3>Base patient: </h3>
          <pre>{JSON.stringify(basePatientData, null, "  ")}</pre>
        </div>
      )}
      {patientData && (
        <div>
          <h3>Fetched patient: </h3>
          <pre>{JSON.stringify(patientData, null, "  ")}</pre>
        </div>
      )}
    </>
  );
};

export default PatientDataViewer;
