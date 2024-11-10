import {Link} from 'react-router-dom'

const Marketing = ({products, param}) => {
  return (
    <div className='container marketing'>
      <div className='row'>
        {products?.map((info)=>
        <div className='col-lg-5' key={info?.id}>
          <img className='bd-placeholder-img-fluid'  src={info?.landing} alt='Imagen' style={{maxWidth:'22rem'}}/>
          <h2 className='fw-normal'>{info?.title}</h2>
          <p>{info?.infoHeader}</p>
          <p><Link className='btn btn-secondary' to={`/${param}/${info?.id}`}>Ver detalles</Link></p>
        </div>
        )}
      </div>
      </div>
  )
}

export default Marketing