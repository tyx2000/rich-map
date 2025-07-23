import styles from "./toplayer.module.css";
import SideMenu from "../sidemenu/sidemenu";
import { Outlet } from "react-router";
import Content from "../content/content";

export default function TopLayer() {
  return (
    <div className={styles.toplayer}>
      {/* <SideMenu></SideMenu> */}
      <Content>
        <Outlet />
      </Content>
    </div>
  );
}
