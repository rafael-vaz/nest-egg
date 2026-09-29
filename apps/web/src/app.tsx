import "./styles/global.css";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/date-picker.css";
import "./styles/toastify.css";
import "./styles/tinymce.css";
import "./styles/month-picker.css";
import "./styles/slider.css";
import "@mantine/dates/styles.css";

import { NuqsAdapter } from "nuqs/adapters/react";
import { useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Announcement from "./components/announcement/announcement";
import ConfirmationModal from "./components/modal/confirmation-modal";
import Modal from "./components/modal/modal";
import ScrollToTop from "./components/scroll-to-top/scroll-to-top";
import ToolMenu from "./components/tool-menu/tool-menu";
import useAuth from "./hooks/user/use-auth";
import AppRoutes from "./routes/app-routes";
import { RootState } from "./store/configure-store";
import toastConfig from "./utils/toast-config";

function App() {
  useAuth();
  const { content } = useSelector((state: RootState) => state.announcement);
  return (
    <BrowserRouter>
      <NuqsAdapter>
        <AppRoutes />
        <ScrollToTop />
        <Modal />
        <ToolMenu />
        <ConfirmationModal />
        <ToastContainer {...toastConfig} />
        <Announcement>{content}</Announcement>
      </NuqsAdapter>
    </BrowserRouter>
  );
}

export default App;
