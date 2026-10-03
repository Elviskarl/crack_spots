import upArrowUrl from "../../../../../assets/up_arrow.png";
import { useState } from "react";
import type { ListItemsProps } from "../../../types";
import "../../../styles/listItems.css";
import LoadingScreen from "../../../../../components/LoadingScreen";
import useReportContext from "../../../hooks/getReportsContex";

export function ListItems(props: ListItemsProps) {
  const [isOpen, setIsOpen] = useState(true);
  const {
    Component,
    imageUrl,
    textContent,
    requiresLoading,
    collapsed,
    setCollapsed,
  } = props;
  const { isLoading } = useReportContext();
  function toggleList(/*e: MouseEvent<HTMLButtonElement>*/) {
    setIsOpen((prevVal) => !prevVal);
  }
  return (
    <li className="list-item" data-tooltip={textContent}>
      <div className="sidebar-heading">
        <div className="list-heading-container">
          <img
            src={imageUrl}
            alt="Upload Icon"
            aria-hidden
            className="small-list-images"
          />
          <span className="list-heading">{textContent}</span>
        </div>
        {requiresLoading ? (
          !collapsed ? (
            <LoadingScreen category="notification" condition={isLoading} />
          ) : null
        ) : null}
        <button
          aria-expanded={isOpen}
          className={`list-heading-toggle ${isOpen ? "open" : "closed"}`}
          onClick={toggleList}
        >
          <img
            src={upArrowUrl}
            alt="Minimize button"
            className="small-list-images"
          />
        </button>
      </div>
      <div className={`sidebar-item ${isOpen ? "open" : "closed"}`}>
        <Component setCollapsed={setCollapsed} />
      </div>
    </li>
  );
}
