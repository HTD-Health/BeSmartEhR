import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const redirectUrl = "http://localhost:3000";
export const clientId = "9976354f-e38c-406e-9827-3b7ede3e2061";
export const fhirUrl =
  "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/";

export const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};
