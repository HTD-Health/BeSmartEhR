### Environment variables used within the application:

```json
{
  "REACT_APP_EHR_PATIENT_CLIENT_ID": "xxxxxx",
  "REACT_APP_EHR_PATIENT_REDIRECT_URI": "http://localhost:3000/launch-ehr-patient",

  "REACT_APP_EHR_PROVIDER_CLIENT_ID": "xxxxxx",
  "REACT_APP_EHR_PROVIDER_REDIRECT_URI": "http://localhost:3000/launch-ehr-provider",

  "REACT_APP_STANDALONE_PATIENT_CLIENT_ID": "xxxxxx",
  "REACT_APP_STANDALONE_PATIENT_REDIRECT_URI": "http://localhost:3000/launch-standalone-patient",

  "REACT_APP_STANDALONE_PROVIDER_CLIENT_ID": "xxxxxx",
  "REACT_APP_STANDALONE_PROVIDER_REDIRECT_URI": "http://localhost:3000/launch-standalone-provider",

  "REACT_APP_CERNER_OPEN_R4_URL": "https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d",
  "REACT_APP_CERNER_SECURED_NON_PATIENT_R4_URL": "https://fhir-ehr-code.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d",
  "REACT_APP_CERNER_SECURED_PATIENT_R4_URL": "https://fhir-myrecord.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d"
}
```

### Description:

`REACT_APP_EHR_PATIENT_CLIENT_ID` - CLIENT_ID related to EHR application with type given as Patient \
`REACT_APP_EHR_PROVIDER_CLIENT_ID` - CLIENT_ID related to EHR application with type given as Provider \

`REACT_APP_STANDALONE_PATIENT_CLIENT_ID` - CLIENT_ID related to Standalone application with type given as Patient \
`REACT_APP_STANDALONE_PROVIDER_CLIENT_ID` - CLIENT_ID related to Standalone application with type given as Provider

Note:
Standalone applications created within `https://code-console.cerner.com/console/apps` are the ones without `SMART Launch URI` parameter specified.
