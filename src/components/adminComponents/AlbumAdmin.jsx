import { Link, useNavigate } from "react-router-dom";
import showConfirmationDialog from '../../Auth/generalComponents/sweetAlert'
import Edition from "../../Auth/generalComponents/Edition/Edition";
import GenericButton from "../../Auth/generalComponents/GenericButton/GenericButton";

const Album = ({ info, items }) => {
 
  const navigate = useNavigate();


  const toEdition = () => {
    navigate(`/admin/product/update/${info.id}`);
  };
  const itemCreate = () => {
    navigate(`/admin/product/item/create/${info.id}`);
  };
  const deleteProduct = async() => {
    const confirmed = await showConfirmationDialog(
      "¿Quiere eliminar este producto?"
    );
    if (confirmed) {
      // Si el usuario hace clic en "Aceptar", ejecutar la funcion:
      //await deleteProduct(item.id);
      console.log('soy el producto a borrar: ',info.id)
      
    }
  };
   const delItem = async(id)=>{
    const confirmed = await showConfirmationDialog(
      "¿Quiere eliminar este item?"
    );
    if (confirmed) {
      // Si el usuario hace clic en "Aceptar", ejecutar la funcion:
      //await deleteProduct(item.id);
      console.log('soy el item a borrar: ',id)
      
    }
   }

  return (
    <>
      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light">Proyecto: {info?.title}</h1>
            <img
                  className="bd-placeholder-img-fluid"
                  src={info?.landing}
                  alt="Imagen"
                  style={{ maxWidth: "22rem" }}
                />
                <h4>Info posicionamiento:</h4>
                <p className="lead text-muted">{info?.infoHeader}</p>
                <hr></hr>
                <h4>Descripcion:</h4>
            <p className="lead text-muted">{info?.infoBody}</p>
            <Link className="btn btn-secondary my-2" to='/admin/product'>
              Volver
            </Link>
                <Edition
                  allowedRoles={["Super Admin", "Admin"]}
                  onClick={toEdition}
                  text={"Editar"}
                  className="btn btn-primary my-2 ms-2"
                />
                <Edition
                  allowedRoles={["Super Admin", "Admin"]}
                  onClick={itemCreate}
                  text={"Crear Item"}
                  className="btn btn-outline-success my-2 ms-2"
                />
                <GenericButton
                  className="btn btn-outline-danger my-2 ms-2"
                  buttonText={"Eliminar producto"}
                  onClick={deleteProduct }
                />
          </div>
        </div>
      </section>
      <section className="album.py-5.bg-light">
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {items?.map((item) => (
                <div className="col" key={item.id}>
                <div className="card shadow-sm">
                  <img className="card-img-top" src={item.img} alt="Card image" />
                  <div className="card-body">
                    <p className="card-text">{item.text}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group">
                        <Link className="btn btn-sm btn-outline-secondary me-3" to={`/admin/product/item/${item.id}`}>
                          Ver mas
                        </Link>
                        <Edition 
                            allowedRoles={["Super Admin", "Admin"]}
                            onClick={()=>{delItem(item.id)}}
                            text={"Borrar"}
                            className="btn btn-sm btn-outline-danger"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Album;
