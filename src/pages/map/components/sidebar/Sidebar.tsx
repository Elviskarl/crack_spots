import { ListItems } from "./components/ListItems";
import "../../styles/sidebar.css";
import uploadImageUrl from "../../../../assets/image-upload-icon.png";
import searchImageUrl from "../../../../assets/search.png";
import ReportForm from "./components/ReportForm";
import SearchListSection from "./components/SearchListSection";

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
          <ListItems
            imageUrl={searchImageUrl}
            Component={SearchListSection}
            textContent="Search"
          />
        </ul>
      </section>
    </aside>
  );
}
