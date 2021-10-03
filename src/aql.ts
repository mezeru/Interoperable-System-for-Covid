import { openehr } from "./service";

export const formatAql = (aqlResultData): Map<string, any>[] => {
  const { columns, rows } = aqlResultData;
  const data = rows.map((row) => {
    return new Map(
      row.map((item, i) => {
        return [columns[i].name, item];
      })
    );
  });
  return data;
};

  export const allCompositions = async (ehrId :string) => {
    const query = `SELECT 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-ADMIN_ENTRY.covid_19_admission.v0]/data[at0001]/items[at0002]/value, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-ADMIN_ENTRY.covid_19_admission.v0]/data[at0001]/items[at0006]/value,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Vital Signs']/items[openEHR-EHR-OBSERVATION.body_temperature.v2]/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Vital Signs']/items[openEHR-EHR-OBSERVATION.respiration.v2]/data[at0001]/events[at0002]/data[at0003]/items[at0062]/value,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Clinical Background']/items[openEHR-EHR-SECTION.adhoc.v1,'Vital Signs']/items[openEHR-EHR-OBSERVATION.respiration.v2]/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value
    from EHR e CONTAINS COMPOSITION c [openEHR-EHR-COMPOSITION.encounter.v1] 
    WHERE e/ehr_id/value='${ehrId}'`

    const r = await openehr.post(`/openehr/v1/query/aql`, {
      q: query,
    });
    return formatAql(r.data);
  };

  