import { Link } from "react-router";
import styles from "./sidemenu.module.css";

const menus = [
  // {
  //   label: "prosemirror",
  //   key: "prosemirror",
  //   path: "/",
  // },
  {
    label: "slatejs",
    key: "slatejs",
    path: "/",
  },
  {
    label: "leaflet",
    key: "leaflet",
    path: "/leaflet",
  },
];

export default function SideMenu() {
  return (
    <div className={styles.sidemenu}>
      {menus.map((menu) => (
        <div key={menu.key} className={styles.menuItem}>
          <Link to={menu.path}>{menu.label}</Link>
        </div>
      ))}
    </div>
  );
}
