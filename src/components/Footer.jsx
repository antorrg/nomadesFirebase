import React from 'react'

const Footer = () => {
  return (
    <div className='text-muted py-5'>
    <div className='container'>
    <hr></hr>
     <p className='float-end mb-1'>
        <a className='btn.btn-primary' href='/'>Volver</a>
     </p>
     <p className='mb-1'>Este es el footer</p>
    </div>
    </div>
  )
}

export default Footer

// footer.text-muted.py-5
// .container
//   p.float-end.mb-1
//     a.btn.btn-primary(href="/") Volver
//   p.mb-1 Esta es una copia de boostrap pronto le vamos a cambiar el nombre.
//   p.mb-0
//     | New to Bootstrap?
//     a(href="/") Visit the homepage