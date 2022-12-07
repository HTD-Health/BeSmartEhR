import FHIR from "fhirclient";

let client;

const getClient = async () => {
  if (!client) {
    client = await FHIR.oauth2.ready();
  }
  return client;
};

const getPatient = async () => {
  const c = await getClient();
  return await c.request(c.patient.fhirUser);
};

const getUser = async () => {
  const c = await getClient();
  return await c.request(client.user.fhirUser);
};

export { getPatient, getUser };
