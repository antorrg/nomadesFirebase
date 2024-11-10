import { Link } from "react-router-dom";

const Album = ({ info, items }) => {
  
 
 

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
            <p className="lead text-muted">{info?.infoBody}</p>
            <Link className="btn btn-secondary my-2" to="/">
              Volver
            </Link>
          </div>
        </div>
      </section>
      <section className="album.py-5.bg-light">
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {items?.map((item) => (
                 <div className="col">
                 <div className="card shadow-sm">
                   <img className="card-img-top" src={item.img} alt="Card image" />
                   <div className="card-body">
                     <p className="card-text">{item.text}</p>
                     <div className="d-flex justify-content-between align-items-center">
                       <div className="btn-group">
                         <Link className="btn btn-sm btn-outline-secondary me-3" to={`/detalle/item/${item.id}`}>
                           Ver mas
                         </Link>
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
