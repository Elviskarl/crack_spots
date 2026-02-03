import "../../styles/sidebar.css";
import { ListItems } from "./components/ListItems";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <section className="sidebar-wrapper">
        <ul className="sidebar-list">
          <ListItems />
        </ul>
      </section>
    </aside>
  );
}
