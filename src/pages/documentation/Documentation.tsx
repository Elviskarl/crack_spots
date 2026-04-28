import { CodeBlock } from "./component/CodeBlock";
import { EndpointContainer } from "./component/EndpointContainer";
import {
  errorSample,
  formDataInterface,
  issueSampleCode,
  postSampleCode,
  reportInterface,
  resolveFormDataInterface,
  resolveReportSample,
  serverResponseInterface,
} from "./data";
import "./styles/index.css";
import "./styles/documentationMediaQuerry.css";
import { Link } from "react-router-dom";

export default function Documentation() {
  return (
    <section className="documentation-section">
      <div className="api-reference">
        <div className="documentation-heading-container api-reference-heading-container">
          <h3>Api Overview</h3>
        </div>
        <div className="documentation-content api-reference-content">
          <p>
            The Crackspots API provides access to road infrastructure reports.
          </p>
          <p>
            The API is publicly accessible and does not require authentication
            or API keys. All data is exchanged in JSON format over standard HTTP
            requests.
          </p>
          <p>
            The API follows REST principles, using resource-oriented URLs,
            accepts form-encoded request bodies, returns JSON-encoded responses,
            and uses standard HTTP response codes, and verbs.
          </p>
        </div>
      </div>
      <div className="getting-started">
        <div className="documentation-heading-container getting-started-heading-container">
          <h4>Getting started</h4>
        </div>
        <div className="documentation-content getting-started-content">
          <p>
            This section will guide you through making your first request to the
            API.
          </p>
          <h4>Basic requests</h4>
          <p>The base URL for all endpoints is:</p>
          <EndpointContainer content="https://crackspots-server.onrender.com/api/v1" />
          <div className="reports-overview-container">
            <div className="descriptions report-description">
              <h5>Reports</h5>
              <p>
                Reports are structured summaries of user submitted data
                collected in the system.
              </p>
              <p>
                Each report is represented as a structured object
                containing:{" "}
              </p>
              <CodeBlock content={reportInterface} heading="Report Interface" />
              <div className="report-properties-explained descriptions">
                <div className="report-properties-intro">
                  <h5>Properties</h5>
                  <p>
                    Below is a definition of each property and its significance:
                  </p>
                </div>
                <div className="report-properties-fields">
                  <h6>_id</h6>
                  <p>
                    This is the unique identifier for the report, generated
                    automatically when the report is created in the database. It
                    is used to reference and manage individual reports within
                    the system.
                  </p>
                </div>
                <div className="report-properties-fields">
                  <h6>user</h6>
                  <p>
                    This field identifies the user who submitted the report. It
                    defaults to <span className="highlight">community</span>{" "}
                    since no authentication is required.
                  </p>
                </div>
                <div className="report-properties-fields">
                  <h6>severity</h6>
                  <div className="severity-fields">
                    <p>
                      This field indicates the estimated condition of the road
                      damage described in the report.
                    </p>
                    <p>
                      It is an enum that can take one of three values:{" "}
                      <span className="highlight">high</span>,{" "}
                      <span className="highlight">medium</span>, or{" "}
                      <span className="highlight">low</span>. This information
                      can be used to prioritize issues and allocate resources
                      for repairs.
                    </p>
                  </div>
                </div>
                <div className="report-properties-fields">
                  <h6>location</h6>
                  <div className="location-fields">
                    <p>
                      The location object contains all the geographic data
                      associated with a report.
                    </p>
                    <p>
                      It follows the GeoJSON format by defining a{" "}
                      <span className="highlight">Point</span> with coordinates,
                      which represent the exact position of the report on the
                      map. These coordinates are used for spatial operations
                      such as distance calculations, proximity searches, and map
                      rendering.
                    </p>
                    <p>
                      The <span className="highlight">address</span> contains
                      location details obtained through reverse geocoding using
                      the{" "}
                      <span className="link-highlight">
                        <a href="https://nominatim.org/" target="_blank">
                          Nominatim API
                        </a>
                      </span>{" "}
                      from OpenStreetMap. This process converts the raw
                      coordinates into a physical address. While this data is
                      not required for geographic calculations, it provides
                      meaningful context that makes the location easier to
                      understand.
                    </p>
                    <p>
                      The <span className="highlight">category</span> represents
                      how Nominatim api service classifies the location.
                    </p>
                  </div>
                </div>
                <div className="report-properties-fields">
                  <h6>cloudinary_url</h6>
                  <p>
                    This is the URL of the image associated with the report as
                    stored on{" "}
                    <span className="link-highlight">
                      <a href="https://cloudinary.com/" target="_blank">
                        Cloudinary
                      </a>
                    </span>
                  </p>
                </div>
                <div className="report-properties-fields">
                  <h6>dateTaken</h6>
                  <p>
                    This field records the date and time when the image
                    associated with the report was taken. It is extracted from
                    the image's EXIF metadata. Specifically, the
                    <span className="highlight">DateTimeOriginal</span> tag, in
                    <span className="highlight"> ISO 8601 format</span>
                  </p>
                </div>
                <div className="report-properties-fields">
                  <h6>createdAt</h6>
                  <p>
                    This timestamp indicates when the report was created in the
                    database. It is automatically generated by the server and is
                    used for tracking and sorting reports based on their
                    creation time.
                  </p>
                </div>

                <div className="report-properties-fields">
                  <h6>status</h6>
                  <p>
                    This field describes whether the issue indicated in the
                    report is still open or has been resolved. It can take one
                    of two values: <span className="highlight">open</span> or{" "}
                    <span className="highlight">resolved</span>.
                  </p>
                </div>
                <div className="report-properties-fields">
                  <h6>resolution</h6>
                  <p>
                    This optional field contains details about how an issue was
                    resolved. It is only present if the status of the report is
                    <span className="highlight">resolved</span>. The resolution
                    object includes information about who resolved the issue,
                    when it was resolved, the date the resolution image was
                    taken, the URL of the resolution image, the coordinates of
                    the resolution, the quality of the repair, and any notes
                    about the resolution process.
                  </p>
                </div>
                <div className="report-properties-fields">
                  <h6>issueId</h6>
                  <p>
                    This field is used to group reports that describe the same
                    underlying road defect at the same location. It is assigned
                    by the server when reports are sufficiently close in
                    distance and occur on the same street.
                  </p>
                </div>
              </div>
              <h5>Issues</h5>
              <p>
                An issue is a <span className="highlight">system-defined </span>{" "}
                representation of road infrastructure defects, formed by
                grouping reports that describe the same damage at a specific
                location.
              </p>
              <p>
                They are not created by users; they are generated by the server
                when reports are sufficiently close in distance, 20 meters, and
                occur on the <span className="highlight">same street.</span>
              </p>
              <p>
                They represent persistent road problems and serve as the base
                for visualization and interaction within the application.
              </p>
              <p>
                Each report is assigned an{" "}
                <span className="highlight">issueId</span>, which is used to
                group reports that refer to the same underlying road defect.
              </p>
              <CodeBlock
                heading="Grouping reports into issues"
                content={issueSampleCode}
              />
            </div>
            <div className="descriptions fetching-report-description">
              <h5>Fetching reports</h5>
              <p>
                All reports are accessible through a{" "}
                <span className="get-highlight">GET</span> request to the{" "}
                <code className="endPoint">/reports</code> endpoint.
              </p>
              <p>
                This endpoint returns a response object containing a{" "}
                <span className="response-highlight">success</span> flag and an{" "}
                <span className="response-highlight">array</span> of report
                objects.
              </p>
              <CodeBlock content={serverResponseInterface} />
            </div>
            <div className="descriptions create-reports-description">
              <h5>Creating Reports</h5>
              <p>
                To create a report, a{" "}
                <span className="post-highlight">POST</span> request is sent to
                the <code className="endPoint">/reports</code> endpoint.
              </p>
              <p>
                This endpoint returns a response object containing a{" "}
                <span className="response-highlight">success</span> flag and an{" "}
                <span className="response-highlight">message</span> confirming a
                report has been created.
              </p>
              <p>
                The request must use a{" "}
                <span className="highlight">multipart/form-data</span> and
                include the following fields:
              </p>
              <div className="api-table">
                <div className="api-table-header">Field</div>
                <div className="api-table-header">Type</div>
                <div className="api-table-header">Required</div>
                <div className="api-table-header">Description</div>

                <div>file</div>
                <div>File</div>
                <div>Yes</div>
                <div>
                  The image file representing the report (e.g. road damage). Max
                  size: 12MB.
                </div>
                <div>coordinates</div>
                <div>String</div>
                <div>Yes</div>
                <div>
                  A JSON string containing the geographic coordinates of the
                  report location.
                </div>
                <div>severity</div>
                <div>Enum</div>
                <div>Yes</div>
                <div>
                  A string containing an esimated condition of the extent of the
                  damage.
                </div>
              </div>
              <CodeBlock
                content={formDataInterface}
                heading="formData interface"
              />
              <CodeBlock content={postSampleCode} heading="sample code" />
              <div className="note">
                <h5>Note:</h5>
                <p>Reports submitted should be within Nairobi county.</p>
                <p>
                  <span>
                    <Link to="/about#about-section-design-considerations">
                      See reason.
                    </Link>
                  </span>
                </p>
              </div>
            </div>
            <div className="descriptions resolve-report-description">
              <h5>Resolving Reports</h5>
              <p>
                To resolve a report, a{" "}
                <span className="post-highlight">PATCH</span> request is sent to
                the <code className="endPoint">/resolve</code> endpoint.
              </p>
              <p>
                This endpoint returns a response object containing a{" "}
                <span className="response-highlight">success</span> flag and an{" "}
                <span className="response-highlight">message</span> confirming
                the report was resolved.
              </p>
              <p className="important-paragraph">
                <span className="important-note">NOTE</span>
                <br />
                The <span className="highlight">issueId</span> is used to group
                related reports and identify the target issue.
                <br />
                When multiple reports exist for the same issueId, only the
                <span className="highlight"> latest report </span>
                is considered and resolved.
                <br />
                This prevents duplicate resolutions and ensures a single source
                of truth.
              </p>
              <p>
                The request must use a{" "}
                <span className="highlight">multipart/form-data</span> and
                include the following fields:
              </p>
              <div className="api-table">
                <div className="api-table-header">Field</div>
                <div className="api-table-header">Type</div>
                <div className="api-table-header">Required</div>
                <div className="api-table-header">Description</div>

                <div>_id</div>
                <div>string</div>
                <div>Yes</div>
                <div>This is the id of the report you want to resolve.</div>

                <div>file</div>
                <div>File</div>
                <div>Yes</div>
                <div>
                  The image file confirming the report was fixed. Max size:
                  12MB.
                </div>
                <div>coordinates</div>
                <div>String</div>
                <div>Yes</div>
                <div>
                  A JSON string containing the geographic coordinates of the
                  report location.
                </div>
                <div>note</div>
                <div>string</div>
                <div>Yes</div>
                <div>
                  A brief description of the resolution. Minimum length: 5
                  characters, Maximum length: 100 characters.
                </div>
                <div>quality</div>
                <div>Enum</div>
                <div>Yes</div>
                <div>
                  Describes the quality of the repair, distinguishing between
                  temporary mitigation and permanent resolution.
                </div>
              </div>
              <CodeBlock
                content={resolveFormDataInterface}
                heading="Resolve formData interface"
              />
              <CodeBlock heading="Sample Code" content={resolveReportSample} />
            </div>
            <div className="descriptions error-descriptions">
              <h5>Errors</h5>
              <p>
                Whenever a request to the back-end is unsuccessful, the server
                returns a JSON error response describing what failed.
              </p>
              <p>
                This simplifiies understanding what went wrong and how to
                resolve the issue.
              </p>
              <CodeBlock heading="Server response" content={errorSample} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
