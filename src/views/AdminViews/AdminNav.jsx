import React, { useState } from "react";
import { Offcanvas, Dropdown, DropdownToggle } from "react-bootstrap";
import "../styles/admin.css";
import { useAuth } from "../../Auth/AuthContext/AuthContext";
import { showSuccess } from "../../Auth/generalComponents/HandlerError";
import { useNavigate, Link } from "react-router-dom";
import Edition from "../../Auth/generalComponents/Edition/Edition";

const AdminNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false); // Estado para mostrar u ocultar el Offcanvas

  // Función para abrir el offcanvas
  const abrirOffcanvas = () => setShowOffcanvas(true);

  // Función para cerrar el offcanvas
  const cerrarOffcanvas = () => setShowOffcanvas(false);

  // Funciones ejecutadas en la navbar:
  const productos = () => {
    navigate("/admin/product");
    cerrarOffcanvas();
  };

  const usuario = () => {
    navigate("/admin/users");
    cerrarOffcanvas();
  };

  const images = () => {
    navigate("/admin/media/images");
    cerrarOffcanvas();
  };

  const ayuda = () => {
    navigate("/admin/help");
    cerrarOffcanvas();
  };

  const action = () => {
    console.log("action")
    cerrarOffcanvas()
  };

  const anotherAction = () => {
    console.log("another action")
    cerrarOffcanvas()
  };

  const algoMas = () => {
    console.log("algo mas")
    cerrarOffcanvas()
  };

  const newProduct = () => {
    navigate("/admin/product/create")
    cerrarOffcanvas()
  };

  const settings = () => {
    console.log("settings")
    cerrarOffcanvas()
  };

  const profile = () => {
    navigate(`/admin/users/profile/${user.id}`)
    cerrarOffcanvas()
  };

  const createUser = () => {
    navigate("/admin/users/create")
    cerrarOffcanvas()
  };

  const sessionCleaner = () => {
    showSuccess("Sesión cerrada");
    navigate("/");
    setTimeout(() => {
      logout();
    }, 1500);
  };

  return (
    <>
      <nav
        className="navbar navbar-dark bg-dark"
        aria-label="Dark offcanvas navbar"
      >
        <div className="container-fluid">
          <button
            className="navbar-toggler me-auto"
            type="button"
            onClick={abrirOffcanvas} // Usamos la función para abrir
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <Link className="navbar-brand text-start" to="/">
            Ir a página principal
          </Link>

          <Offcanvas
            show={showOffcanvas} // Controla si se muestra el offcanvas
            onHide={cerrarOffcanvas}
            placement="start" // Posición del offcanvas (izquierda)
            className="text-bg-dark maxNavWidht"
            aria-labelledby="offcanvasNavbarDarkLabel"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarDarkLabel">
                <Link className="nav-link active" to="/admin">
                  Administrador
                </Link>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="admin-content">
              <ul className="navbar-nav justify-content-start flex-grow-1 ps-3">
                <li className="nav-item">
                  <button
                    className="nav-link active d-block text-start w-100"
                    onClick={productos}
                  >
                    Producto
                  </button>
                </li>
                <Dropdown className="nav-item">
                  {/* <Dropdown.Toggle className="nav-link d-block text-start w-100" id="dropdown-basic">
                    Usuarios
                  </Dropdown.Toggle> */}
                  <Dropdown.Toggle
                    as={Edition}
                    allowedRoles={["Super Admin", "Administrador"]}
                    text={"Usuarios"}
                    className="nav-link active d-block text-start w-100"
                  />
                  <Dropdown.Menu className="dropdown-menu-dark text-small shadow">
                    <Dropdown.Item onClick={usuario}>
                      Ver usuarios
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={createUser}>
                      Crear Usuario
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <li className="nav-item">
                  <button
                    className="nav-link active d-block text-start w-100"
                    onClick={images}
                  >
                    Imagenes guardadas
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link active d-block text-start w-100"
                    onClick={ayuda}
                  >
                    Ayuda ?
                  </button>
                </li>
                <Dropdown className="nav-item">
                  <Dropdown.Toggle
                    className="nav-link d-block text-start w-100"
                    id="dropdown-basic"
                  >
                    Portada
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu-dark text-small shadow">
                    <Dropdown.Item onClick={action}>Portada...</Dropdown.Item>
                    <Dropdown.Item onClick={anotherAction}>
                      Videos
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={algoMas}>
                      Something else here
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </ul>
              <hr />
              <Dropdown align="end">
                <Dropdown.Toggle
                  as="a"
                  className="d-flex align-items-center text-white text-decoration-none nav-link"
                >
                  <img
                    src={user.picture}
                    alt="Not found"
                    width="32"
                    height="32"
                    className="rounded-circle me-2"
                  />
                  <strong>
                    {user.given_name ? user.given_name : user.nickname}
                  </strong>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-dark text-small shadow">
                  <Dropdown.Item onClick={newProduct}>
                    Nuevo producto...
                  </Dropdown.Item>
                  <Dropdown.Item onClick={settings}>Settings</Dropdown.Item>
                  <Dropdown.Item onClick={profile}>Perfil</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={sessionCleaner}>
                    Cerrar sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </nav>
    </>
  );
};

export default AdminNav;

// import React, { useState, useEffect, useRef } from 'react';
// import { Offcanvas } from 'bootstrap';
// import { Dropdown } from 'react-bootstrap';
// import '../styles/admin.css';
// import { useAuth } from '../../Auth/AuthContext/AuthContext';
// import { showSuccess } from '../../Auth/userComponents/HandlerError';
// import { useNavigate, Link} from 'react-router-dom';
// import Edition from '../../Auth/userComponents/Edition/Edition';

// const AdminNav = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const offcanvasRef = useRef(null);
//   const [offcanvasInstance, setOffcanvasInstance] = useState(null); // Guardamos la instancia de Offcanvas

//   // Inicializar el componente offcanvas cuando se monta
//   useEffect(() => {
//     const offcanvasEl = offcanvasRef.current;
//     const bsOffcanvas = new Offcanvas(offcanvasEl);
//     setOffcanvasInstance(bsOffcanvas); // Almacenamos la instancia para controlarla
//     return () => {
//       bsOffcanvas.dispose(); // Limpiar la instancia al desmontar
//     };
//   }, []);

//   // Función para abrir el offcanvas
//   const abrirOffcanvas = () => {
//     if (offcanvasInstance) {
//       offcanvasInstance.show();
//     }
//   };

//   // Función para cerrar el offcanvas
//   const cerrarOffcanvas = () => {
//     if (offcanvasInstance) {
//       offcanvasInstance.hide();
//     }
//   };

//   // Funciones ejecutadas en la navbar:
//   const productos = () => {
//     navigate('/admin/product')
//     cerrarOffcanvas();
//   };

//   const usuario = () => {
//     navigate('/admin/user')
//     cerrarOffcanvas();
//   };

//   const ayuda = () => {
//     navigate('/admin/help')
//     //setHelp((prevHelp) => !prevHelp);
//     cerrarOffcanvas();
//   };

//   const action = () => {
//     console.log('action');
//   };

//   const anotherAction = () => {
//     console.log('another action');
//   };

//   const algoMas = () => {
//     console.log('algo mas');
//   };

//   const newProduct = () => {
//     console.log('nuevo producto');
//   };

//   const settings = () => {
//     console.log('settings');
//   };

//   const profile = () => {
//     console.log('perfil');
//   };

//   const sessionCleaner = () => {
//     showSuccess('Sesión cerrada');
//     navigate('/');
//     setTimeout(() => {
//       logout();
//     }, 1500);
//   };

//   return (
//     <>
//       <nav className="navbar navbar-dark bg-dark" aria-label="Dark offcanvas navbar">
//         <div className="container-fluid">
//           <button
//             className="navbar-toggler me-auto"
//             type="button"
//             onClick={abrirOffcanvas} // Usamos la función para abrir
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <Link className="navbar-brand text-start" to="/">
//             Ir a pagina principal
//           </Link>
//           <div
//             className="offcanvas offcanvas-start text-bg-dark maxNavWidht"
//             tabIndex="-1"
//             id="offcanvasNavbarDark"
//             ref={offcanvasRef} // Vinculamos con la referencia
//             aria-labelledby="offcanvasNavbarDarkLabel"
//           >
//             <div className="offcanvas-header">
//               <h5 className="offcanvas-title" id="offcanvasNavbarDarkLabel"><Link className='nav-link active' to='/admin'>Administrador</Link></h5>
//               <button
//                 type="button"
//                 className="btn-close btn-close-white"
//                 onClick={cerrarOffcanvas} // Cerramos el offcanvas
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="offcanvas-body admin-content">
//               <ul className="navbar-nav justify-content-start flex-grow-1 ps-3">
//                 <li className="nav-item">
//                   <button className="nav-link active d-block text-start w-100" onClick={productos}>
//                     Producto
//                   </button>
//                 </li>
//                 <li className="nav-item">
//                   <Edition
//                     allowedRoles={['Super Admin', 'Admin']}
//                     onClick={usuario} // Cerramos el offcanvas en el click
//                     text={'Usuarios'}
//                     className="nav-link active d-block text-start w-100"
//                   />
//                 </li>
//                 <li className="nav-item">
//                   <button className="nav-link active d-block text-start w-100" onClick={ayuda}>
//                     Ayuda ?
//                   </button>
//                 </li>
//                 <Dropdown className="nav-item">
//                   <Dropdown.Toggle className="nav-link d-block text-start w-100" id="dropdown-basic">
//                     Portada
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu className="dropdown-menu-dark text-small shadow">
//                     <Dropdown.Item onClick={action}>Portada...</Dropdown.Item>
//                     <Dropdown.Item onClick={anotherAction}>Videos</Dropdown.Item>
//                     <Dropdown.Divider />
//                     <Dropdown.Item onClick={algoMas}>Something else here</Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>

//               </ul>
//               <hr />
//             <Dropdown align="end">
//                 <Dropdown.Toggle as="a" className="d-flex align-items-center text-white text-decoration-none nav-link">
//                   <img src={user.picture} alt="Not found" width="32" height="32" className="rounded-circle me-2" />
//                   <strong>{user.given_name ? user.given_name : user.nickname}</strong>
//                 </Dropdown.Toggle>

//               <Dropdown.Menu className="dropdown-menu-dark text-small shadow">
//                 <Dropdown.Item onClick={newProduct}>Nuevo proyecto...</Dropdown.Item>
//                 <Dropdown.Item onClick={settings}>Settings</Dropdown.Item>
//                 <Dropdown.Item onClick={profile}>Perfil</Dropdown.Item>
//                 <Dropdown.Divider />
//                 <Dropdown.Item onClick={sessionCleaner}>Cerrar sesión</Dropdown.Item>
//               </Dropdown.Menu>
//             </Dropdown>
//             </div>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default AdminNav;
