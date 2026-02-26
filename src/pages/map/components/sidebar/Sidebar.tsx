import { ListItems } from "./components/ListItems";
import "../../styles/sidebar.css";
import uploadImageUrl from "../../../../assets/image-upload-icon.png";
import searchImageUrl from "../../../../assets/search.png";
import ReportForm from "./components/ReportForm";
import SearchListSection from "./components/SearchListSection";
import menuImageUrl from "../../../../assets/menu-outline.svg";
import { type Dispatch, type SetStateAction } from "react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  function toggleSidebar() {
    setCollapsed((prevVal) => !prevVal);
  }
  return (
    <aside className="sidebar">
      <section className="sidebar-wrapper">
        <ul className={`sidebar-list ${collapsed ? "" : "closed"}`}>
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
      <div className="sidebar-toggle-image-container" onClick={toggleSidebar}>
        <img src={menuImageUrl} alt="menu" />
      </div>
    </aside>
  );
}
