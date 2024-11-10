import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from '../Auth/AuthContext/AuthContext'

const Header = () => {
  const {authenticated, logout}= useAuth()
  const navigate = useNavigate()
  return (
    <header className='mb-auto'>
      <div>
        <h3 className='float-md-start mb-0 caption-nav colon-link'>
            Nomades
            <a className='nav-link' href='/login'>: </a>
            Cabañas de pastores
        </h3>
        <nav className='nav nav-masthead justify-content-center float-md-end caption-nav'>
            <a className='nav-link fw-bold py-1 px-0 active' aria-current='page' href='/'>Home</a>
            {authenticated?
            <button className='nav-link fw-bold py-1 px-0 active' onClick={()=>{navigate('/admin')}}>Admin</button> : null
            }
            <Link className='nav-link fw-bold py-1 px-0 active' to='/contacto' >Contacto</Link>
            <Link className='nav-link fw-bold py-1 px-0 active' to='/acerca'>Acerca de </Link>
        </nav>
     </div>
    </header>
  )
}

export default Header
