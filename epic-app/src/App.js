import {useLocation} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import axios from "axios";

const redirectUrl = 'http://localhost:3000';
const clientId = "9976354f-e38c-406e-9827-3b7ede3e2061";

function useQuery() {
    const {search} = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

function App() {
    const query = useQuery();
    const [code, setCode] = useState();

    useEffect(() => {
        if (query.get('code') !== code) {
            setCode(query.get('code'));
        }
    }, [query])

    const [accessToken, setAccessToken] = useState();
    const [patient, setPatient] = useState();
    const [patientData, setPatientData] = useState();

    useEffect(() => {
        if (!code) {
            return;
        }

        (async () => {
            const params = new URLSearchParams();
            params.append("grant_type", "authorization_code");
            params.append("redirect_uri", redirectUrl);
            params.append("code", code);
            params.append("client_id", clientId);
            params.append("state", "1234");

            const response = await axios
                .post(
                    "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token",
                    params,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );

            setPatient(response.data.patient);
            setAccessToken(response.data.access_token);
        })()
    }, [code]);

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        (async () => {
            const response = await axios
                .get(
                    `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Patient/${patient}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                )

            setPatientData(response.data);
        })()
    }, [accessToken])

    return (
        <div className="App">
            <a href={`https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize?response_type=code&redirect_uri=${redirectUrl}&client_id=${clientId}&state=1234&scope=patient.read, patient.search`}>
                <button>Sign in</button>
            </a>
            {patientData && (
                <div>
                    <div>
                        <span>First Name: </span><span>{patientData.name[0].given[0]}</span>
                    </div>
                    <div>
                        <span>Last Name: </span><span>{patientData.name[0].family}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
