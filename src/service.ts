import axios from "axios";
const BASE_URL = "http://localhost:8080";


export const openehr = axios.create({
  baseURL: `${BASE_URL}/ehrbase/rest`,
  headers: {
    Accept: "application/json",
  },
});