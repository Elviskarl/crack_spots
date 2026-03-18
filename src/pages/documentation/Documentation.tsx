import { CodeBlock } from "./component/CodeBlock";
import { EndpointContainer } from "./component/EndpointContainer";
import {
  formDataInterface,
  postSampleCode,
  reportInterface,
  serverResponseInterface,
} from "./data";
import "./styles/index.css";
import "./styles/documentationMediaQuerry.css";

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
            It is organized around REST, and has predictable resource-oriented
            URLs, accepts form-encoded request bodies, returns JSON-encoded
            responses, and uses standard HTTP response codes, and verbs.
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
              <h5>Create a Report</h5>
              <p>
                To create a report, a{" "}
                <span className="post-highlight">POST</span> request is sent to
                the <code className="endPoint">/reports</code> endpoint.
              </p>
              <p>
                This request should have appended to the body, a{" "}
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
