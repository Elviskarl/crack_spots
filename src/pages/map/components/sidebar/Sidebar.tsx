import { ListItems } from "./components/ListItems";
import "../../styles/sidebar.css";
import uploadImageUrl from "../../../../assets/image-upload-icon.png";
import searchImageUrl from "../../../../assets/search.png";
import ReportForm from "./components/ReportForm";
import SearchListSection from "./components/SearchListSection";
import menuImageUrl from "../../../../assets/menu-outline.svg";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  function toggleSidebar() {
    setIsOpen((prevVal) => !prevVal);
  }
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
      <div
        className={`sidebar-toggle-image-container ${!isOpen ? "" : "closed"}`}
        onClick={toggleSidebar}
      >
        <img src={menuImageUrl} alt="menu" />
      </div>
    </aside>
  );
}
