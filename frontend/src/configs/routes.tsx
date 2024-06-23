import { createBrowserRouter } from "react-router-dom";
import ListPasswords from "../components/pages/ListPasswords/ListPasswords";
import CreatePassword from "../components/pages/CreatePassword/CreatePassword";
import EncryptPassword from "../components/pages/EncryptPassword/EncryptPassword";
import DecryptPassword from "../components/pages/DecryptPassword/DecryptPassword";
import GeneratePassword from "../components/pages/GeneratePassword/GeneratePassword";
import DeviceInfo from "../components/pages/DeviceInfo/DeviceInfo";
import CreatePolicy from "../components/pages/CreatePolicy/CreatePolicy";
import EditPassword from "../components/pages/EditPassword/EditPassword";


const router = createBrowserRouter([
    { path: "/", element: <ListPasswords /> },
    { path: "/password", element: <CreatePassword /> },
    { path: "/password/encrypt/:pass_uid", element: <EncryptPassword /> },
    { path: "/password/decrypt/:pass_uid", element: <DecryptPassword /> },
    { path: "/generate-password", element: <GeneratePassword /> },
    { path: "/device-info", element: <DeviceInfo /> },
    { path: "/policy", element: <CreatePolicy /> },
    { path: "/password/edit/:pass_uid", element: <EditPassword /> },
  ]);

  export default router;