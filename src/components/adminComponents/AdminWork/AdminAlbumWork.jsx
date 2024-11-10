import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import { getStoredImgs} from '../../../redux/actions'

const AdminAlbumWork = () => {

  return (
            <>
        <section className="py-5 text-center container">
            <div className="row py-lg-5">
            <div className="col-lg-6 col-md-8 mx-auto">
                <h1 className="fw-light">Nuestro trabajo</h1>
                <Link className="btn btn-secondary my-2" to="/admin">
                Volver
                </Link>
            </div>
            </div>
        </section>
        <section className="album py-5 bg-light mb-3">
        <div className="container">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {images?.map((work) => (
                <div className="col" key={work.id}>
                <div className="card shadow-sm">
                <img className="card-img-top" src={work.image} alt="Card image" />
                <div className="card-body">
                    <p className="card-text">{work.title}</p>
                    <div className="d-flex justify-content-between align-items-center">
                    <div className="btn-group">
                        <Link className="btn btn-sm btn-outline-secondary me-3" to={'/'}>
                        Ver detalle
                        </Link>
                        <Link className="btn btn-sm btn-outline-primary me-3" to={'/'}>
                        Editar
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
  )
}

export default AdminAlbumWork
