import { Outlet } from "react-router-dom";

import MainContainer from "../main-container/main-container";
import ResourceMenu from "../resource-menu/resource-menu";
import Sidebar from "../sidebar/sidebar";
import ToolMenuButton from "../tool-menu/tool-menu-button";
import Topbar from "../topbar/topbar";
import TutorialTour from "../tutorial/tutorial-tour";

const DefaultLayout = () => {
  return (
    <>
      <Sidebar />
      <MainContainer>
        <Topbar />
        <Outlet />
      </MainContainer>
      <ToolMenuButton />
      <ResourceMenu />
      <TutorialTour />
    </>
  );
};

export default DefaultLayout;
