import axios from "axios";

export const openehr = axios.create({baseURL:"http://localhost:8080/ehrbase/rest/openehr/v1",
headers: {
    Accept: "application/json",
  }});

  export const ehrscape = axios.create({
    baseURL:"http://localhost:8080/ehrbase/rest/ecis/v1",
    headers: {
      Accept: "application/json",
    },
  });

  export const mongo = axios.create({baseURL:"https://covidbackend.azurewebsites.net/"});
