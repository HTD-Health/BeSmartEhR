import FHIR from "fhirclient";

const getClient = async () => {
  await FHIR.oauth2.ready();
};

const getPatient = async () => {
  const client = await getClient();
  console.log(client);
};

export { getPatient };
