import { Bounce, ToastContainerProps } from "react-toastify";

const toastConfig: ToastContainerProps = {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: false,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: "dark",
  limit: 3,
  transition: Bounce,
};

export default toastConfig;
