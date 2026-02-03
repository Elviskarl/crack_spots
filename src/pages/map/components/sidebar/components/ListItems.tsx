import upArrowUrl from "../../../../../assets/up_arrow.png";
import uploadImageUrl from "../../../../../assets/image-upload-icon.png";
import ReportForm from "./ReportForm";
import { useState, type MouseEvent } from "react";

export function ListItems() {
  const [isOpen, setIsOpen] = useState(true);
  function toggleList(e: MouseEvent<HTMLButtonElement>) {
    if (e.target) {
      console.log("clicked");
      setIsOpen((prevVal) => !prevVal);
    }
  }
  return (
    <>
      <li className="sidebar-heading">
        <div className="list-heading-container">
          <img
            src={uploadImageUrl}
            alt="Upload Icon"
            aria-hidden
            className="small-list-images"
          />
          <span className="list-heading">Upload</span>
        </div>
        <button
          className={`list-heading-toggle ${isOpen ? "closed" : "open"}`}
          onClick={toggleList}
        >
          <img
            src={upArrowUrl}
            alt="Minimize button"
            className="small-list-images"
          />
        </button>
      </li>
      <li className={`sidebar-item ${isOpen ? "open" : "closed"}`}>
        <ReportForm />
      </li>
    </>
  );
}
