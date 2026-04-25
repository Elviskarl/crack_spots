import { ListItems } from "./components/ListItems";
import "../../styles/sidebar.css";
import uploadImageUrl from "../../../../assets/image-upload-icon.png";
import searchImageUrl from "../../../../assets/search.png";
import filterImageUrl from "../../../../assets/funnel-outline.svg";
import ReportForm from "./components/ReportForm";
import SearchListSection from "./components/SearchListSection";
import menuImageUrl from "../../../../assets/menu-outline.svg";
import checkmarkResolve from "../../../../assets/checkmark-resolve.png";
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
import ResolveReport from "./ResolveReport";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const { setNotification, notification } = useContext(ReportContext)!;
  const sidebarWrapper = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sidebarWrapper.current) {
      sidebarWrapper.current.scrollTo({
        behavior: "smooth",
        top: sidebarWrapper.current.scrollHeight,
      });
    }
  }, [notification]);

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
          <ListItems
            imageUrl={checkmarkResolve}
            Component={ResolveReport}
            textContent="Resolve"
            requiresLoading={true}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        </ul>
        {notification && (
          <Notifications
            message={notification?.message}
            func={setNotification}
            type={notification.type}
          />
        )}
      </section>
      <div className="sidebar-toggle-image-container" onClick={toggleSidebar}>
        <img src={menuImageUrl} alt="menu" />
      </div>
    </aside>
  );
}
