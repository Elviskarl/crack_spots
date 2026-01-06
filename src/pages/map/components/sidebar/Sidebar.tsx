import ReportForm from "./components/ReportForm";
import uploadImageUrl from "../../../../assets/image-upload-icon.png";
import upArrowUrl from "../../../../assets/up_arrow.png";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <section className="sidebar-wrapper">
        <ul className="sidebar-list">
          <li className="sidebar-heading">
            <div className="list-heading-container">
              <img
                src={uploadImageUrl}
                alt=""
                aria-hidden
                className="small-list-images"
              />
              <span className="list-heading">Upload</span>
            </div>
            <img
              src={upArrowUrl}
              alt="Minimize button"
              className="small-list-images"
            />
          </li>
          <li className="sidebar-item">
            <ReportForm />
          </li>
        </ul>
      </section>
    </aside>
  );
}
