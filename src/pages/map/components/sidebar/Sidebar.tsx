import { ListItems } from "./components/ListItems";
import "../../styles/sidebar.css";
import uploadImageUrl from "../../../../assets/image-upload-icon.png";
import ReportForm from "./components/ReportForm";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <section className="sidebar-wrapper">
        <ul className="sidebar-list">
          <ListItems
            imageUrl={uploadImageUrl}
            Component={ReportForm}
            textContent="Upload"
          />
        </ul>
      </section>
    </aside>
  );
}
