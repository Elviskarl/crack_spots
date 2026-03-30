import { ListItems } from "./components/ListItems";
import "../../styles/sidebar.css";
import uploadImageUrl from "../../../../assets/image-upload-icon.png";
import searchImageUrl from "../../../../assets/search.png";
import filterImageUrl from "../../../../assets/funnel-outline.svg";
import ReportForm from "./components/ReportForm";
import SearchListSection from "./components/SearchListSection";
import menuImageUrl from "../../../../assets/menu-outline.svg";
import {
  useContext,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import FilterReports from "./components/FilterReports";
import { ReportContext } from "../../../../context/createReportContext";
import { Notifications } from "./components/Notifications";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const { isLoading, setNotification } = useContext(ReportContext)!;
  const sidebarWrapper = useRef<HTMLElement>(null);
  useEffect(() => {
    if (sidebarWrapper.current) {
      sidebarWrapper.current.scrollTo({
        behavior: "smooth",
        top: sidebarWrapper.current.scrollHeight,
      });
    }
  });
  function toggleSidebar() {
    setCollapsed((prevVal) => !prevVal);
  }
  return (
    <aside className={`sidebar ${collapsed ? "closed" : ""}`}>
      <section className="sidebar-wrapper" ref={sidebarWrapper}>
        <ul className={`sidebar-list ${collapsed ? "closed" : ""}`}>
          <ListItems
            imageUrl={uploadImageUrl}
            Component={ReportForm}
            textContent="Upload"
            requiresLoading={false}
          />
          <ListItems
            imageUrl={searchImageUrl}
            Component={SearchListSection}
            textContent="Search"
            requiresLoading={true}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
          <ListItems
            imageUrl={filterImageUrl}
            textContent="Filter"
            Component={FilterReports}
            requiresLoading={true}
            collapsed={collapsed}
          />
        </ul>
        {isLoading && (
          <Notifications
            message="Fetching Reports from the database, please wait"
            func={setNotification}
            type="Info"
          />
        )}
      </section>
      <div className="sidebar-toggle-image-container" onClick={toggleSidebar}>
        <img src={menuImageUrl} alt="menu" />
      </div>
    </aside>
  );
}
