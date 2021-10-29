import { openehr } from "./service";

export const formatAql = (aqlResultData): any => {
  const { columns, rows } = aqlResultData;
  return { columns, rows };



};

  export const allCompositions = async (ehrId :string) => {
    const query = `SELECT
    c/context/start_time as Time,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-ADMIN_ENTRY.covid_19_admission.v0]/data[at0001]/items[at0002]/value as Admit,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Vital Signs']/items[openEHR-EHR-OBSERVATION.body_temperature.v2]/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value as Temperature,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Vital Signs']/items[openEHR-EHR-OBSERVATION.respiration.v2]/data[at0001]/events[at0002]/data[at0003]/items[at0062]/value as Pulse_Presence,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Vital Signs']/items[openEHR-EHR-OBSERVATION.respiration.v2]/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value as Pulse_Rate,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Vital Signs']/items[openEHR-EHR-OBSERVATION.pulse_oximetry.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0006]/value as SpO2,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-OBSERVATION.symptom_sign_screening.v0]/data[at0001]/events[at0002]/data[at0003]/items[at0028]/value as Symptoms,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-OBSERVATION.symptom_sign_screening.v0]/data[at0001]/events[at0002]/data[at0003]/items[at0034]/value as Screening_Purpose,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-OBSERVATION.symptom_sign_screening.v0]/data[at0001]/events[at0002]/data[at0003]/items[at0022] as Symptom_Detail,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-OBSERVATION.condition_screening.v0]/data[at0001]/events[at0002]/data[at0003]/items[at0028]/value as Presenting_conditions,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-OBSERVATION.condition_screening.v0]/data[at0001]/events[at0002]/data[at0003]/items[at0022] as specific_condition,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-OBSERVATION.travel_screening.v0]/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value as Travel,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-OBSERVATION.travel_screening.v0]/data[at0001]/events[at0002]/data[at0003]/items[at0026]/value as DomInter,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Lab Testing']/items[openEHR-EHR-OBSERVATION.laboratory_test_result.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0005]/value as Test,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Lab Testing']/items[openEHR-EHR-OBSERVATION.laboratory_test_result.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0075]/value as Test_time,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Lab Testing']/items[openEHR-EHR-OBSERVATION.laboratory_test_result.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0057]/value as Result,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Lab Testing']/items[openEHR-EHR-OBSERVATION.laboratory_test_result.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0101]/value as Suggesition,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-OBSERVATION.age.v0]/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value as time_lived
    from EHR e CONTAINS COMPOSITION c
    WHERE e/ehr_id/value='${ehrId}'
    ORDER by Time DESC
    `;

    const r = await openehr.post(`/openehr/v1/query/aql`, {
      q: query,
    });
    return formatAql(r.data);
  };

  