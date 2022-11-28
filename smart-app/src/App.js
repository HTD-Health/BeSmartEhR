import "./App.css";
import { useEffect } from "react";
import React from "react";

function App({ client }) {
  const [patients, setPatients] = React.useState(null);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    try {
      const resp = await client.request("Patient")
      setPatients(resp);
      console.log(await client.request("/metadata"))
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="App">
      <strong>BeSmartEhR</strong>
      <div>Logged as:</div>
      <div >
        {patients &&
          patients.entry.map((patient) => (
            <div key={patient.resource.id}>
              <p>{patient.resource.id}</p>
              <p>
                {patient.resource.name[0].given[0]}{" "}
                {patient.resource.name[0].family}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
