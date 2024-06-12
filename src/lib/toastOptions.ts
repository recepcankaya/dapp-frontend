import { Bounce, ToastOptions } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export function getShortLengthToastOptions(): ToastOptions {
  return {
    toastId: uuidv4(),
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  };
}

export const adminOrBranchCameraToastOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
  transition: Bounce,
};
