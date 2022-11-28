import logo from './logo.svg';
import './App.css';
import { fhirclient } from 'fhirclient/lib/types';



function App() {

  const fhirUrl = "https://launch.smarthealthit.org/v/r4/sim/eyJoIjoiMSIsImUiOiJlNDQzYWM1OC04ZWNlLTQzODUtOGQ1NS03NzVjMWI4ZjNhMzcifQ/fhir";
  const audValue = "";

  const client_id = "be-smart-ehr";
  const client_secret = "clientSecretSuperSecret";

  // GET /.well-known/smart-configuration HTTP/1.1

  fhirclient.client_id = client_id;
  fhirclient.client_secret = client_secret;
  fhirclient.fhirUrl = fhirUrl;
  //fhirclient.audValue


  return (
    <div className="App">
      <header className="App-header">
        <strong>BeSmartEhR</strong>
      </header>

      <div className='App-body'>

      </div>

    </div>
  );
}

export default App;
