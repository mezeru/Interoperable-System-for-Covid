import { openehr } from "./service";

export const formatAql = (aqlResultData): any => {
  const { columns, rows } = aqlResultData;
  return { columns, rows };
};


export const Lab = async (ehrId :string) =>{
  const query = `SELECT c/context/start_time/value as time, c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Lab Testing']/items[openEHR-EHR-OBSERVATION.laboratory_test_result.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0005]/value as Test, c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Lab Testing']/items[openEHR-EHR-OBSERVATION.laboratory_test_result.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0075]/value as Test_time, c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Lab Testing']/items[openEHR-EHR-OBSERVATION.laboratory_test_result.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0057]/value as Result, c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Lab Testing']/items[openEHR-EHR-OBSERVATION.laboratory_test_result.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0101]/value as Suggesition from EHR e CONTAINS COMPOSITION c WHERE e/ehr_id/value='${ehrId}' LIMIT 15 ORDER by time DESC
  `;

  const r = await openehr.post(`/query/aql`, {
    q: query,
  });
  return formatAql(r.data);  
}


export const compositionsList = async (ehrId :string) =>{
    const query = `SELECT c/context/start_time/value as time, c/uid/value as uid from EHR e CONTAINS COMPOSITION c where e/ehr_id/value='${ehrId}' LIMIT 15 ORDER BY time DESC
    `
    const r = await openehr.post(`/query/aql`, {
      q: query,
    });
    return formatAql(r.data);  
}

  export const Vitals = async (ehrId :string) => {
    const query = `SELECT
    c/context/start_time as Time,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-ADMIN_ENTRY.covid_19_admission.v0]/data[at0001]/items[at0002]/value as Admit,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Vital Signs']/items[openEHR-EHR-OBSERVATION.body_temperature.v2]/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value as Temperature,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Vital Signs']/items[openEHR-EHR-OBSERVATION.respiration.v2]/data[at0001]/events[at0002]/data[at0003]/items[at0062]/value as Pulse_Presence,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Vital Signs']/items[openEHR-EHR-OBSERVATION.respiration.v2]/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value as Pulse_Rate,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Vital Signs']/items[openEHR-EHR-OBSERVATION.pulse_oximetry.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0006]/value as SpO2
    from EHR e CONTAINS COMPOSITION c
    WHERE e/ehr_id/value='${ehrId}'
    LIMIT 10
    ORDER by Time ASC

    `;

    const r = await openehr.post(`/query/aql`, {
      q: query,
    });
    return formatAql(r.data);
  };

  export const Travel = async (ehrId :string) => {
    const query = `SELECT
    c/context/start_time as Time,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-OBSERVATION.travel_screening.v0]/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value as Travel,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-OBSERVATION.travel_screening.v0]/data[at0001]/events[at0002]/data[at0003]/items[at0026]/value as DomInter
    from EHR e CONTAINS COMPOSITION c
    WHERE e/ehr_id/value='${ehrId}'
    ORDER by Time DESC
    `
    const r = await openehr.post(`/query/aql`, {
      q: query,
    });
    return formatAql(r.data);
  }

  export const Assessment = async (ehrId :string) => {
    const query = `SELECT
    c/context/start_time as Time,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Assessment']/items[openEHR-EHR-EVALUATION.health_risk-covid.v0]/data[at0001]/items[at0002.1]/value as Risk,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Assessment']/items[openEHR-EHR-EVALUATION.health_risk-covid.v0]/data[at0001]/items[at0016]/items[at0013.1]/value as RiskFactor,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Assessment']/items[openEHR-EHR-EVALUATION.health_risk-covid.v0]/data[at0001]/items[at0016]/items[at0017.1]/value as Presence,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Assessment']/items[openEHR-EHR-EVALUATION.health_risk-covid.v0]/data[at0001]/items[at0016]/items[at0029]/value as date,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Assessment']/items[openEHR-EHR-EVALUATION.health_risk-covid.v0]/data[at0001]/items[at0003.1]/value as RiskAssess
    from EHR e CONTAINS COMPOSITION c
    WHERE e/ehr_id/value='${ehrId}'
    ORDER by Time DESC
    `
    const r = await openehr.post(`/query/aql`, {
      q: query,
    });
    return formatAql(r.data);
  }

  export const Clinical = async (ehrId :string) => {
    const query = `SELECT
    c/context/start_time as Time,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-OBSERVATION.symptom_sign_screening.v0]/data[at0001]/events[at0002]/data[at0003]/items[at0028]/value as Symptoms,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-OBSERVATION.symptom_sign_screening.v0]/data[at0001]/events[at0002]/data[at0003]/items[at0034]/value as Screening_Purpose,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-OBSERVATION.symptom_sign_screening.v0]/data[at0001]/events[at0002]/data[at0003]/items[at0022] as Symptom_Detail,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-OBSERVATION.condition_screening.v0]/data[at0001]/events[at0002]/data[at0003]/items[at0028]/value as Presenting_conditions,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-OBSERVATION.condition_screening.v0]/data[at0001]/events[at0002]/data[at0003]/items[at0022] as specific_condition
    from EHR e CONTAINS COMPOSITION c
    WHERE e/ehr_id/value='${ehrId}'
    ORDER by Time DESC
    `;

    const r = await openehr.post(`/query/aql`, {
      q: query,
    });
    return formatAql(r.data);
  };

  