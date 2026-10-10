import{c as e,n as t,r as n}from"./index-n3ekhTkQ.js";var r=e();async function i(e){try{await navigator.clipboard.writeText(e.innerText)}catch(e){console.error(`Failed to copy text`,e)}}var a=`data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20class='ionicon'%20viewBox='0%200%20512%20512'%3e%3cpath%20fill='none'%20stroke='currentColor'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke-width='32'%20d='M416%20128L192%20384l-96-96'/%3e%3c/svg%3e`,o=`data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20class='ionicon'%20viewBox='0%200%20512%20512'%3e%3crect%20x='128'%20y='128'%20width='336'%20height='336'%20rx='57'%20ry='57'%20fill='none'%20stroke='currentColor'%20stroke-linejoin='round'%20stroke-width='32'/%3e%3cpath%20d='M383.5%20128l.5-24a56.16%2056.16%200%2000-56-56H112a64.19%2064.19%200%2000-64%2064v216a56.16%2056.16%200%200056%2056h24'%20fill='none'%20stroke='currentColor'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke-width='32'/%3e%3c/svg%3e`,s=t();function c({content:e,el:t}){let[n,c]=(0,r.useState)(!1),l=(0,r.useRef)(null);return(0,s.jsxs)(`div`,{className:`base-url`,children:[(0,s.jsx)(`span`,{className:`important`,ref:l,children:e}),(0,s.jsx)(`div`,{className:`copy-image-container`,title:`${n?`copied`:`copy`}`,onClick:()=>{if(t?.current){i(t.current),c(!0),setTimeout(()=>{c(!1)},2e3);return}l.current&&(i(l.current),c(!0),setTimeout(()=>{c(!1)},2e3))},children:(0,s.jsx)(`img`,{src:n?a:o,alt:`copy`})})]})}function l({content:e,heading:t}){let n=(0,r.useRef)(null);return(0,s.jsxs)(`div`,{className:`code-block`,children:[(0,s.jsx)(c,{content:t||`https://crackspots-server.onrender.com/api/v1/reports`,el:n}),(0,s.jsx)(`pre`,{children:(0,s.jsx)(`code`,{ref:n,children:e})})]})}function u(){return(0,s.jsxs)(`section`,{className:`documentation-section`,children:[(0,s.jsxs)(`div`,{className:`api-reference`,children:[(0,s.jsx)(`div`,{className:`documentation-heading-container api-reference-heading-container`,children:(0,s.jsx)(`h3`,{children:`Api Overview`})}),(0,s.jsxs)(`div`,{className:`documentation-content api-reference-content`,children:[(0,s.jsx)(`p`,{children:`The Crackspots API provides access to road infrastructure reports.`}),(0,s.jsx)(`p`,{children:`The API is publicly accessible and does not require authentication or API keys. All data is exchanged in JSON format over standard HTTP requests.`}),(0,s.jsx)(`p`,{children:`The API follows REST principles, using resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, and verbs.`})]})]}),(0,s.jsxs)(`div`,{className:`getting-started`,children:[(0,s.jsx)(`div`,{className:`documentation-heading-container getting-started-heading-container`,children:(0,s.jsx)(`h4`,{children:`Getting started`})}),(0,s.jsxs)(`div`,{className:`documentation-content getting-started-content`,children:[(0,s.jsx)(`p`,{children:`This section will guide you through making your first request to the API.`}),(0,s.jsx)(`h4`,{children:`Basic requests`}),(0,s.jsx)(`p`,{children:`The base URL for all endpoints is:`}),(0,s.jsx)(c,{content:`https://crackspots-server.onrender.com/api/v1`}),(0,s.jsxs)(`div`,{className:`reports-overview-container`,children:[(0,s.jsxs)(`div`,{className:`descriptions report-description`,children:[(0,s.jsx)(`h5`,{children:`Reports`}),(0,s.jsx)(`p`,{children:`Reports are structured summaries of user submitted data collected in the system.`}),(0,s.jsxs)(`p`,{children:[`Each report is represented as a structured object containing:`,` `]}),(0,s.jsx)(l,{content:`interface Report {
  _id: string;
    user: string; // "community"
    severity: "high" | "medium" | "low";
    location: GeoPoint;
    cloudinary_url: string;
    dateTaken: string;
    issueId: string;
    createdAt: Date;
    status: "open" | "resolved";
    resolution?: {
      resolvedBy: string; // community
      resolvedAt: Date;
      dateTaken: string;
      imageUrl: string;
      coordinates: number[]; // [longitude, latitude]
      note: string;
      quality: "temporary" | "permanent";
    };

interface GeoPoint {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
    category?: string; 
    address?: {
    road?: string;
    city?: string;
    state?: string;
    neighbourhood?: string;
    };
}`,heading:`Report Interface`}),(0,s.jsxs)(`div`,{className:`report-properties-explained descriptions`,children:[(0,s.jsxs)(`div`,{className:`report-properties-intro`,children:[(0,s.jsx)(`h5`,{children:`Properties`}),(0,s.jsx)(`p`,{children:`Below is a definition of each property and its significance:`})]}),(0,s.jsxs)(`div`,{className:`report-properties-fields`,children:[(0,s.jsx)(`h6`,{children:`_id`}),(0,s.jsx)(`p`,{children:`This is the unique identifier for the report, generated automatically when the report is created in the database. It is used to reference and manage individual reports within the system.`})]}),(0,s.jsxs)(`div`,{className:`report-properties-fields`,children:[(0,s.jsx)(`h6`,{children:`user`}),(0,s.jsxs)(`p`,{children:[`This field identifies the user who submitted the report. It defaults to `,(0,s.jsx)(`span`,{className:`highlight`,children:`community`}),` `,`since no authentication is required.`]})]}),(0,s.jsxs)(`div`,{className:`report-properties-fields`,children:[(0,s.jsx)(`h6`,{children:`severity`}),(0,s.jsxs)(`div`,{className:`severity-fields`,children:[(0,s.jsx)(`p`,{children:`This field indicates the estimated condition of the road damage described in the report.`}),(0,s.jsxs)(`p`,{children:[`It is an enum that can take one of three values:`,` `,(0,s.jsx)(`span`,{className:`highlight`,children:`high`}),`,`,` `,(0,s.jsx)(`span`,{className:`highlight`,children:`medium`}),`, or`,` `,(0,s.jsx)(`span`,{className:`highlight`,children:`low`}),`. This information can be used to prioritize issues and allocate resources for repairs.`]})]})]}),(0,s.jsxs)(`div`,{className:`report-properties-fields`,children:[(0,s.jsx)(`h6`,{children:`location`}),(0,s.jsxs)(`div`,{className:`location-fields`,children:[(0,s.jsx)(`p`,{children:`The location object contains all the geographic data associated with a report.`}),(0,s.jsxs)(`p`,{children:[`It follows the GeoJSON format by defining a`,` `,(0,s.jsx)(`span`,{className:`highlight`,children:`Point`}),` with coordinates, which represent the exact position of the report on the map. These coordinates are used for spatial operations such as distance calculations, proximity searches, and map rendering.`]}),(0,s.jsxs)(`p`,{children:[`The `,(0,s.jsx)(`span`,{className:`highlight`,children:`address`}),` contains location details obtained through reverse geocoding using the`,` `,(0,s.jsx)(`span`,{className:`link-highlight`,children:(0,s.jsx)(`a`,{href:`https://nominatim.org/`,target:`_blank`,children:`Nominatim API`})}),` `,`from OpenStreetMap. This process converts the raw coordinates into a physical address. While this data is not required for geographic calculations, it provides meaningful context that makes the location easier to understand.`]}),(0,s.jsxs)(`p`,{children:[`The `,(0,s.jsx)(`span`,{className:`highlight`,children:`category`}),` represents how Nominatim api service classifies the location.`]})]})]}),(0,s.jsxs)(`div`,{className:`report-properties-fields`,children:[(0,s.jsx)(`h6`,{children:`cloudinary_url`}),(0,s.jsxs)(`p`,{children:[`This is the URL of the image associated with the report as stored on`,` `,(0,s.jsx)(`span`,{className:`link-highlight`,children:(0,s.jsx)(`a`,{href:`https://cloudinary.com/`,target:`_blank`,children:`Cloudinary`})})]})]}),(0,s.jsxs)(`div`,{className:`report-properties-fields`,children:[(0,s.jsx)(`h6`,{children:`dateTaken`}),(0,s.jsxs)(`p`,{children:[`This field records the date and time when the image associated with the report was taken. It is extracted from the image's EXIF metadata. Specifically, the`,(0,s.jsx)(`span`,{className:`highlight`,children:`DateTimeOriginal`}),` tag, in`,(0,s.jsx)(`span`,{className:`highlight`,children:` ISO 8601 format`})]})]}),(0,s.jsxs)(`div`,{className:`report-properties-fields`,children:[(0,s.jsx)(`h6`,{children:`createdAt`}),(0,s.jsx)(`p`,{children:`This timestamp indicates when the report was created in the database. It is automatically generated by the server and is used for tracking and sorting reports based on their creation time.`})]}),(0,s.jsxs)(`div`,{className:`report-properties-fields`,children:[(0,s.jsx)(`h6`,{children:`status`}),(0,s.jsxs)(`p`,{children:[`This field describes whether the issue indicated in the report is still open or has been resolved. It can take one of two values: `,(0,s.jsx)(`span`,{className:`highlight`,children:`open`}),` or`,` `,(0,s.jsx)(`span`,{className:`highlight`,children:`resolved`}),`.`]})]}),(0,s.jsxs)(`div`,{className:`report-properties-fields`,children:[(0,s.jsx)(`h6`,{children:`resolution`}),(0,s.jsxs)(`p`,{children:[`This optional field contains details about how an issue was resolved. It is only present if the status of the report is`,(0,s.jsx)(`span`,{className:`highlight`,children:`resolved`}),`. The resolution object includes information about who resolved the issue, when it was resolved, the date the resolution image was taken, the URL of the resolution image, the coordinates of the resolution, the quality of the repair, and any notes about the resolution process.`]})]}),(0,s.jsxs)(`div`,{className:`report-properties-fields`,children:[(0,s.jsx)(`h6`,{children:`issueId`}),(0,s.jsx)(`p`,{children:`This field is used to group reports that describe the same underlying road defect at the same location. It is assigned by the server when reports are sufficiently close in distance and occur on the same street.`})]})]}),(0,s.jsx)(`h5`,{children:`Issues`}),(0,s.jsxs)(`p`,{children:[`An issue is a `,(0,s.jsx)(`span`,{className:`highlight`,children:`system-defined `}),` `,`representation of road infrastructure defects, formed by grouping reports that describe the same damage at a specific location.`]}),(0,s.jsxs)(`p`,{children:[`They are not created by users; they are generated by the server when reports are sufficiently close in distance, 20 meters, and occur on the `,(0,s.jsx)(`span`,{className:`highlight`,children:`same street.`})]}),(0,s.jsx)(`p`,{children:`They represent persistent road problems and serve as the base for visualization and interaction within the application.`}),(0,s.jsxs)(`p`,{children:[`Each report is assigned an`,` `,(0,s.jsx)(`span`,{className:`highlight`,children:`issueId`}),`, which is used to group reports that refer to the same underlying road defect.`]}),(0,s.jsx)(l,{heading:`Grouping reports into issues`,content:`const grouped = Object.
    groupBy(reports, (report) => report.issueId);

  const groupedArray = Object.entries(grouped).map(([issueId, reports]) => ({
    issueId,
    reports: reports ?? [],
  }));`})]}),(0,s.jsxs)(`div`,{className:`descriptions fetching-report-description`,children:[(0,s.jsx)(`h5`,{children:`Fetching reports`}),(0,s.jsxs)(`p`,{children:[`All reports are accessible through a`,` `,(0,s.jsx)(`span`,{className:`get-highlight`,children:`GET`}),` request to the`,` `,(0,s.jsx)(`code`,{className:`endPoint`,children:`/reports`}),` endpoint.`]}),(0,s.jsxs)(`p`,{children:[`This endpoint returns a response object containing a`,` `,(0,s.jsx)(`span`,{className:`response-highlight`,children:`success`}),` flag and an`,` `,(0,s.jsx)(`span`,{className:`response-highlight`,children:`array`}),` of report objects.`]}),(0,s.jsx)(l,{content:`interface ApiResponse {
    success: boolean;
    data: Report[];
}`})]}),(0,s.jsxs)(`div`,{className:`descriptions create-reports-description`,children:[(0,s.jsx)(`h5`,{children:`Creating Reports`}),(0,s.jsxs)(`p`,{children:[`To create a report, a`,` `,(0,s.jsx)(`span`,{className:`post-highlight`,children:`POST`}),` request is sent to the `,(0,s.jsx)(`code`,{className:`endPoint`,children:`/reports`}),` endpoint.`]}),(0,s.jsxs)(`p`,{children:[`This endpoint returns a response object containing a`,` `,(0,s.jsx)(`span`,{className:`response-highlight`,children:`success`}),` flag and an`,` `,(0,s.jsx)(`span`,{className:`response-highlight`,children:`message`}),` confirming a report has been created.`]}),(0,s.jsxs)(`p`,{children:[`The request must use a`,` `,(0,s.jsx)(`span`,{className:`highlight`,children:`multipart/form-data`}),` and include the following fields:`]}),(0,s.jsxs)(`div`,{className:`api-table`,children:[(0,s.jsx)(`div`,{className:`api-table-header`,children:`Field`}),(0,s.jsx)(`div`,{className:`api-table-header`,children:`Type`}),(0,s.jsx)(`div`,{className:`api-table-header`,children:`Required`}),(0,s.jsx)(`div`,{className:`api-table-header`,children:`Description`}),(0,s.jsx)(`div`,{children:`file`}),(0,s.jsx)(`div`,{children:`File`}),(0,s.jsx)(`div`,{children:`Yes`}),(0,s.jsx)(`div`,{children:`The image file representing the report (e.g. road damage). Max size: 12MB.`}),(0,s.jsx)(`div`,{children:`coordinates`}),(0,s.jsx)(`div`,{children:`String`}),(0,s.jsx)(`div`,{children:`Yes`}),(0,s.jsx)(`div`,{children:`A JSON string containing the geographic coordinates of the report location.`}),(0,s.jsx)(`div`,{children:`severity`}),(0,s.jsx)(`div`,{children:`Enum`}),(0,s.jsx)(`div`,{children:`Yes`}),(0,s.jsx)(`div`,{children:`A string containing an esimated condition of the extent of the damage.`})]}),(0,s.jsx)(l,{content:`file:File

interface CoordinateData {
  GPSLatitude: number;
  GPSLongitude: number;
  GPSLatitudeRef: "N" | "S";
  GPSLongitudeRef: "E" | "W";
  DateTimeOriginal: string;
}
  
severity: "low" | "medium" | "high";`,heading:`formData interface`}),(0,s.jsx)(l,{content:`const formData = new FormData();

const coordinates:CoordinateData = {
  GPSLatitude,
  GPSLongitude,
  GPSLatitudeRef,
  GPSLongitudeRef,
  DateTimeOriginal
}

formData.append("file", file);
formData.append(
  "coordinates",
  JSON.stringify(coordinates)
);

formData.append("severity", severityInput.value);

const results = await fetch(
  "https://crackspots-server.onrender.com/api/v1/reports",
  {
    method: "POST",
    body: formData,
  },
);
`,heading:`sample code`}),(0,s.jsxs)(`div`,{className:`note`,children:[(0,s.jsx)(`h5`,{children:`Note:`}),(0,s.jsx)(`p`,{children:`Reports submitted should be within Nairobi county.`}),(0,s.jsx)(`p`,{children:(0,s.jsx)(`span`,{children:(0,s.jsx)(n,{to:`/about#about-section-design-considerations`,children:`See reason.`})})})]})]}),(0,s.jsxs)(`div`,{className:`descriptions resolve-report-description`,children:[(0,s.jsx)(`h5`,{children:`Resolving Reports`}),(0,s.jsxs)(`p`,{children:[`To resolve a report, a`,` `,(0,s.jsx)(`span`,{className:`post-highlight`,children:`PATCH`}),` request is sent to the `,(0,s.jsx)(`code`,{className:`endPoint`,children:`/resolve`}),` endpoint.`]}),(0,s.jsxs)(`p`,{children:[`This endpoint returns a response object containing a`,` `,(0,s.jsx)(`span`,{className:`response-highlight`,children:`success`}),` flag and an`,` `,(0,s.jsx)(`span`,{className:`response-highlight`,children:`message`}),` confirming the report was resolved.`]}),(0,s.jsxs)(`p`,{className:`important-paragraph`,children:[(0,s.jsx)(`span`,{className:`important-note`,children:`NOTE`}),(0,s.jsx)(`br`,{}),`The `,(0,s.jsx)(`span`,{className:`highlight`,children:`issueId`}),` is used to group related reports and identify the target issue.`,(0,s.jsx)(`br`,{}),`When multiple reports exist for the same issueId, only the`,(0,s.jsx)(`span`,{className:`highlight`,children:` latest report `}),`is considered and resolved.`,(0,s.jsx)(`br`,{}),`This prevents duplicate resolutions and ensures a single source of truth.`]}),(0,s.jsxs)(`p`,{children:[`The request must use a`,` `,(0,s.jsx)(`span`,{className:`highlight`,children:`multipart/form-data`}),` and include the following fields:`]}),(0,s.jsxs)(`div`,{className:`api-table`,children:[(0,s.jsx)(`div`,{className:`api-table-header`,children:`Field`}),(0,s.jsx)(`div`,{className:`api-table-header`,children:`Type`}),(0,s.jsx)(`div`,{className:`api-table-header`,children:`Required`}),(0,s.jsx)(`div`,{className:`api-table-header`,children:`Description`}),(0,s.jsx)(`div`,{children:`_id`}),(0,s.jsx)(`div`,{children:`string`}),(0,s.jsx)(`div`,{children:`Yes`}),(0,s.jsx)(`div`,{children:`This is the id of the report you want to resolve.`}),(0,s.jsx)(`div`,{children:`file`}),(0,s.jsx)(`div`,{children:`File`}),(0,s.jsx)(`div`,{children:`Yes`}),(0,s.jsx)(`div`,{children:`The image file confirming the report was fixed. Max size: 12MB.`}),(0,s.jsx)(`div`,{children:`coordinates`}),(0,s.jsx)(`div`,{children:`String`}),(0,s.jsx)(`div`,{children:`Yes`}),(0,s.jsx)(`div`,{children:`A JSON string containing the geographic coordinates of the report location.`}),(0,s.jsx)(`div`,{children:`note`}),(0,s.jsx)(`div`,{children:`string`}),(0,s.jsx)(`div`,{children:`Yes`}),(0,s.jsx)(`div`,{children:`A brief description of the resolution. Minimum length: 5 characters, Maximum length: 100 characters.`}),(0,s.jsx)(`div`,{children:`quality`}),(0,s.jsx)(`div`,{children:`Enum`}),(0,s.jsx)(`div`,{children:`Yes`}),(0,s.jsx)(`div`,{children:`Describes the quality of the repair, distinguishing between temporary mitigation and permanent resolution.`})]}),(0,s.jsx)(l,{content:`file:File

interface CoordinateData {
  GPSLatitude: number;
  GPSLongitude: number;
  GPSLatitudeRef: "N" | "S";
  GPSLongitudeRef: "E" | "W";
  DateTimeOriginal: string;
}

_id: string;

quality: "temporary" | "permanent";
  
note: string;`,heading:`Resolve formData interface`}),(0,s.jsx)(l,{heading:`Sample Code`,content:`const formData = new FormData();

formData.append("file", fileCopy);

formData.append("coordinates", JSON.stringify(coordsCopy));

if (textAreaEl) {
  formData.append("note", textAreaEl.value);
}

if (repairSelectEl) {
  formData.append("quality", repairSelectEl.value);
}

formData.append("_id", _id);

const results = await fetch(
  "https://crackspots-server.onrender.com/api/v1/resolve",
  {
    method: "PATCH",
    body: formData,
  },
);`})]}),(0,s.jsxs)(`div`,{className:`descriptions error-descriptions`,children:[(0,s.jsx)(`h5`,{children:`Errors`}),(0,s.jsx)(`p`,{children:`Whenever a request to the back-end is unsuccessful, the server returns a JSON error response describing what failed.`}),(0,s.jsx)(`p`,{children:`This simplifiies understanding what went wrong and how to resolve the issue.`}),(0,s.jsx)(l,{heading:`Server response`,content:`res.status(400).json({
 success: false, message: error.message 
 });
`})]})]})]})]})]})}export{u as default};