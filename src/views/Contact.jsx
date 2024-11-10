import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Header} from '../components/IndexComponents'
import './styles/contact.css'
import { ValidContact } from '../Auth/generalComponents/internalUtils/Validate'

const Contact = () => {
const navigate = useNavigate()
const [input, setInput] = useState({
  email : "",
  issue: "",
  message: ""
})
const [error, setError] = useState({
  email : "",
  issue: "",
  message: ""
})
  const handleChange = (event)=>{
    const {name, value} = event.target;
    const newInput = { ...input, [name]: value };
  setInput(newInput);

  const validationErrors = ValidContact(newInput);
  setError(validationErrors);
  }

  const handleSubmit = ()=>{
    const validationErrors = ValidContact(input);

  if (Object.keys(validationErrors).length === 0) {
    console.log("Formulario enviado", input);
    // Lógica de envío del formulario (ej. API)
  } else {
    setError(validationErrors); // Muestra los errores si hay
    //console.log("Errores de validación:", validationErrors);
  }
  }
  const allowButton = !input.email.trim() ||
                      !input.issue.trim() || 
                      !input.message.trim() ||
                      error.email ||
                      error.issue ||
                      error.message;

  const onClose = ()=>navigate(-1)
  const handleWhatsApp = () => {
    const phoneNumber = '5492226556123' // Reemplaza con tu número (incluye código de país)
    const message = '¡Hola! Me gustaría obtener más información.' // Mensaje predeterminado
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="imageBack">
       <Header/>
    <div className="coverMail">
      <div className="container-md modal-content colorBack contactContainer rounded-4 shadow">
        <div className="container mt-5">
          <h1>Contactenos:</h1>
          <section
            className="needs-validation"
            id="sendEmail"
            noValidate
          >
            <div className="row">
              <div className="col-md-12 mb-3">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Su email:
                  </label>
                  <input
                    className="form-control"
                    type="email"
                    id="email"
                    name="email"
                    value={input.email}
                    onChange={handleChange}
                  />
                  {error.email && <p className="errorMsg">{error.email}</p>}
                </div>
                <div className="mb-3">
                  <label htmlFor="issue" className="form-label">
                    Asunto:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="issue"
                    name="issue"
                    value={input.issue}
                    onChange={handleChange}
                  />
                  {error.issue && <p className="errorMsg">{error.issue}</p>}
                </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Mensaje:
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  rows="5"
                  value={input.message}
                  onChange={handleChange}
                  required
                />
                {error.message && <p className="errorMsg">{error.message}</p>}
              </div>
             </div>
              <div className="d-flex flex-row me-3">
                <button
                  className="btn btn-primary mb-3 me-2"
                  type="button"
                  id="submitButton"
                  onClick={handleSubmit}
                  disabled={allowButton}
                >
                  Enviar
                </button>
                <button
                  className="btn btn-secondary mb-3"
                  onClick={() => {
                    onClose();
                  }}
                >
                  Cancelar
                </button>
                <button
                className="btn btn-success mb-3 ms-5 me-2"
                type="button"
                onClick={handleWhatsApp}
              >
                <i className="bi bi-whatsapp me-1"></i>
                WhatsApp
              </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Contact