import { Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "./Auth/AuthContext";
import { useEffect, useCallback, useState } from "react";
import interceptor from "./Interceptor";
import ProtectedRoute from "./ProtectedRoutes";
import CookieConsent from "react-cookie-consent";
import {
  Landing,
  Detail,
  Item,
  Contact,
  About,
  OurWork,
  Videos,
  Admin,
  Login,
  Error,
} from "./views/Index";
import {
  TabsPage,
  ProductComp,
  ProductCreate,
  ProductEdition,
  AdminItem,
  ItemCreate,
  DetailCardUpd,
  UserComp,
  UserCreate,
  UserUpgrade,
  EditPassword,
  UserEdition,
  ImagesComponent,
  CreateWork,
  OurWorkEdit,
  CreateLanding,
  LandEdition,
  MediaCreate,
  MediaUpdate,
  HelpView,
} from "./components/adminComponents/AdminIndex";

function App() {
  const { authenticated, logout, expirationTime } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");

  //Cambiar tema
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    // Guardar preferencia en localStorage
    //localStorage.setItem('theme', newTheme);
  };
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  const redirectToError = useCallback(
    (status, message) => {
      navigate("/error", { state: { status, message } });
    },
    [navigate]
  );

  useEffect(() => {
    interceptor(
      logout,
      redirectToError //(status, message) => navigate('/error', { state: { status, message }})
    );
  }, [logout, redirectToError]);

  return (
    <div>
      {/* <div>
      <CookieConsent
        location="bottom"
        buttonText="Aceptar"
        cookieName="userConsent"
        style={{ background: "#2B373B", color: "#fff" }}
        buttonStyle={{ background: "#4CAF50", color: "#fff", fontSize: "13px" }}
        expires={365}
      >
        Este sitio utiliza cookies para mejorar tu experiencia.{" "}
        <span style={{ fontSize: "10px" }}>Lee más en nuestra Política de Cookies.</span>
      </CookieConsent>
    </div> */}

      <Routes>
        <Route
          path="/"
          element={<Landing theme={theme} toggleTheme={toggleTheme} />}
        />
        <Route path="/detalle/:id" element={<Detail />} />
        <Route path="/detalle/item/:id" element={<Item />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/acerca" element={<About />} />
        <Route path="/nuestro-trabajo" element={<OurWork />} />
        <Route path="/videos" element={<Videos />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route index element={<TabsPage />} />
          <Route path="/admin/product" element={<ProductComp />} />
          <Route path="/admin/product/:id" element={<ProductComp />} />
          <Route path="/admin/product/create" element={<ProductCreate />} />
          <Route
            path="/admin/product/update/:id"
            element={<ProductEdition />}
          />
          <Route path="/admin/product/item/:id" element={<AdminItem />} />
          <Route
            path="/admin/product/item/create/:id"
            element={<ItemCreate />}
          />
          <Route
            path="/admin/product/item/update/:id"
            element={<DetailCardUpd />}
          />
          <Route path="/admin/users" element={<UserComp />} />
          <Route path="/admin/users/create" element={<UserCreate />} />
          <Route path="/admin/users/upgrade/:id" element={<UserUpgrade />} />
          <Route
            path="/admin/users/updateinfo/:id"
            element={<EditPassword />}
          />
          <Route path="/admin/users/:id" element={<UserComp />} />
          <Route path="/admin/users/update/:id" element={<UserEdition />} />
          <Route path="/admin/users/profile/:id" element={<UserComp />} />
          <Route path="/admin/media/images" element={<ImagesComponent />} />
          {/* <Route path= '/admin/page' element={<Ad.TabsPage/>}/> */}
          <Route path="/admin/work/create" element={<CreateWork />} />
          <Route path="/admin/work/update/:id" element={<OurWorkEdit />} />
          <Route path="/admin/land/create" element={<CreateLanding />} />
          <Route path="/admin/land/update/:id" element={<LandEdition />} />
          <Route path="/admin/media/create" element={<MediaCreate />} />
          <Route path="/admin/media/update/:id" element={<MediaUpdate />} />
          <Route path="/admin/help" element={<HelpView />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/error" element={<Error />} />
        <Route
          path="*"
          element={
            <Error state={{ status: 404, message: "Página no encontrada" }} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
