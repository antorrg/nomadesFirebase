import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getItem } from "../../../../redux/actions";
import { updateItem } from "../../../../utils/productEndPoints";
import { Form } from "react-bootstrap";
import showConfirmationDialog from "../../../../Auth/generalComponents/sweetAlert";
import "./detailCardUpd.css";
import ImageUploader from "../../../../utils/ImageUploader";
import ImageSelector from "../../../../utils/ImageSelector";

const DetailCardUpd = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [imgUrl, setImgUrl] = useState(false)
  const item1 = useSelector((state) => state.Item);
  useEffect(() => {
    dispatch(getItem(id));
  }, [id]);

  const onClose = () => {
    navigate(-1);
  };

  const [item, setItem] = useState({
    text: "",
    img: "",
    saver: false,
    useImg: false,
  });

  useEffect(() => {
    if (item1) {
      setItem({
        text: item1.text || "",
        img: item1.img || "",
        saver: item1.saver || false,
        useImg: item1.useImg || false,
      });
    }
  }, [item1]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleImageChange = (imageUrl) => {
    setItem((prevItem) => ({
      ...prevItem,
      img: imageUrl,
    }));
  };
  const handleSwitchChange = (e) => {
    const { checked, id } = e.target;
    setItem((prevItem) => ({
      ...prevItem,
      [id]: checked,
    }));
  };
  const handleImgUrlSwitchChange = () => {
    setImgUrl(prev => {
      const newValue = !prev; // Invertir el estado actual de imgUrl
  
      // Actualizar useImg según el nuevo valor de imgUrl
      setItem(prevItem => ({
        ...prevItem,
        useImg: newValue, // Establecer useImg en true o false
      }));
  
      return newValue; // Retornar el nuevo valor de imgUrl
    });
  };
  

  const handleSubmit = async () => {
    // Lógica para actualizar el producto
    const confirmed = await showConfirmationDialog(
      "¿Está seguro de actualizar este item?"
    );
    if (confirmed) {
      // Si el usuario hace clic en "Aceptar", ejecutar la funcion:
      await updateItem(id, item, onClose);
      
    }
  };
  return (
    <div className="imageBack">
      <div className="coverBack">
        <div className="container-md modal-content colorBack formProductContainer rounded-4 shadow">
          <div className="container mt-5">
            <h1>Actualizacion de item</h1>
            <section
              className="needs-validation"
              id="updateItemForm"
              noValidate
            >
              <div className="row">
              {imgUrl ?
              <div className="col-md-6 mb-3">
                  <ImageSelector onImageSelect={handleImageChange}/>
                </div>
                :
                <div className="col-md-6 mb-3">
                  <ImageUploader
                    titleField={"Imagen:"}
                    imageValue={item.img}
                    onImageUpload={handleImageChange}
                  />
                </div>
                }
                <div className="mb-3 form-check form-switch">
                    <Form.Check 
                      type="switch"
                      id="imgUrlSwitch"
                      checked={imgUrl}
                      label="Active para elegir imagen guardada"
                      onChange={handleImgUrlSwitchChange}
                    />
                </div>
                <div className="col-md-6 mb-3"></div>
                <div className="mb-3">
                  <label htmlFor="text" className="form-label">
                    Texto:
                  </label>
                  <textarea
                    className="form-control"
                    type="text"
                    id="text"
                    name="text"
                    value={item.text}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3 form-check form-switch">
                    <Form.Check 
                      type="switch"
                      id="saver"
                      checked={item.saver}
                      label="Active para conservar imagen antigua"
                      onChange={handleSwitchChange}
                    />
                </div>

                <div className="d-flex flex-row me-3">
                  <button
                    className="btn btn-primary mb-3 me-2"
                    type="button"
                    id="submitButton"
                    onClick={handleSubmit}
                  >
                    Actualizar
                  </button>
                  <button
                    className="btn btn-primary mb-3"
                    onClick={() => {
                      onClose();
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCardUpd;
