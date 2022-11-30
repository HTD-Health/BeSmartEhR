### Environment variables used within the application:

```json
{
  "REACT_APP_EHR_APP_CLIENT_ID": "xxxxxx",
  "REACT_APP_EHR_REDIRECT_URI": "http://localhost:3000/launch-ehr",

  "REACT_APP_STANDALONE_CLIENT_ID": "xxxxxx",
  "REACT_APP_STANDALONE_REDIRECT_URI": "http://localhost:3000/launch-standalone",

  "REACT_APP_CERNER_OPEN_R4_URL": "https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d/",
  "REACT_APP_CERNER_SECURED_NON_PATIENT_R4_URL": "https://fhir-ehr-code.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d/",
  "REACT_APP_CERNER_SECURED_PATIENT_R4_URL": "https://fhir-myrecord.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d/"
}
```

### Description:

`REACT_APP_EHR_APP_CLIENT_ID` - CLIENT_ID related to Cerner application which handles EHR launch \
`REACT_APP_STANDALONE_CLIENT_ID` - CLIENT_ID related to Cerner application which handles Standalone launch
