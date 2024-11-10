import {useNavigate} from 'react-router-dom'
import { Accordion, Button } from 'react-bootstrap';
import * as Ad from './AdminIndex'

const HelpView = () => {
  const navigate = useNavigate()
  return (
    <>
    <div className="container-sm">
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Acerca de la portada:</Accordion.Header>
          <Accordion.Body>
            <strong>Este es el primer ítem para configurar y mantener.</strong> 
            En este encontramos la imagen de portada.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Acerca de Usuarios</Accordion.Header>
          <Accordion.Body>
            <strong>Este es el cuerpo del segundo ítem del acordeón.</strong> 
            Está oculto por defecto hasta que el plugin de colapsado añade las clases apropiadas. 
            Puedes modificar esto con CSS personalizado o sobrescribiendo las variables por defecto.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Ítem #3</Accordion.Header>
          <Accordion.Body>
            <strong>Este es el cuerpo del tercer ítem del acordeón.</strong> 
            Puedes modificar cualquier parte de esto con CSS o sobrescribiendo las variables por defecto.
            También es importante notar que puedes colocar casi cualquier HTML dentro del 
            <code>.accordion-body</code>.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <br />

      <Button className="nav-link active text-start w-10 pt-20" onClick={() => navigate(-1)}>
        <h5>Volver</h5>
      </Button>
    </div>
  </>

  )
}

export default HelpView