import ReportForm from "./components/ReportForm";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <section className="sidebar-wrapper">
        <ul className="sidebar-list">
          <li className="sidebar-heading">
            <div className="list-heading-container">
              <h4 className="list-heading">Upload</h4>
            </div>
          </li>
          <li className="sidebar-item">
            <div className="form-container report-upload-form">
              <ReportForm />
            </div>
          </li>
        </ul>
      </section>
    </aside>
  );
}
