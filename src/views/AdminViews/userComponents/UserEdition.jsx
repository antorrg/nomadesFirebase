import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import ImageUploader from "../../../utils/ImageUploader";
import showConfirmationDialog from "../../../Auth/generalComponents/sweetAlert";
import * as endpoint from "../../../Auth/authHelpers/Auth";
import { getUserById } from "../../../redux/actions";

const UserEdition = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const user1 = useSelector((state) => state.UserById);

  useEffect(() => {
    dispatch(getUserById(id));
  }, [id]);

  const onClose = () => {
    navigate(-1);
  };

  const [user, setUser] = useState({
    email: "",
    picture: "",
    given_name: "",
    country: "",
  });

  useEffect(() => {
    if (user1) {
      setUser({
        email: user1.email || "",
        picture: user1.picture || "",
        given_name: user1.given_name || "",
        country: user1.country || "",
      });
    }
  }, [user1]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleImageChange = (imageUrl) => {
    setUser((prevUser) => ({
      ...prevUser,
      picture: imageUrl,
    }));
  };

  const handleSubmit = async () => {
    // Lógica para actualizar el producto
    const confirmed = await showConfirmationDialog(
      "¿Está seguro de actualizar este usuario?"
    );
    if (confirmed) {
      // Si el usuario hace clic en "Aceptar", ejecutar la funcion:
      await endpoint.updateUser(id, user, onClose);
    }
  };
  return (
    <div className="imageBack">
      <div className="coverBack">
        <div className="container-md modal-content colorBack formProductContainer rounded-4 shadow">
          <div className="container mt-5">
            <h1>Actualizacion de usuario:</h1>
            <section
              className="needs-validation"
              id="updateItemForm"
              noValidate
            >
              <div className="row">
                <div className="col-md-6 mb-3">
                  <ImageUploader
                    titleField={"Imagen:"}
                    imageValue={user.picture}
                    onImageUpload={handleImageChange}
                  />
                </div>
                <div className="col-md-6 mb-3"></div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                  />
                </div>{" "}
                <div className="mb-3">
                  <label htmlFor="given_name" className="form-label">
                    Nombre:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="given_name"
                    name="given_name"
                    value={user.given_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="country" className="form-label">
                    Pais:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="country"
                    name="country"
                    value={user.country}
                    onChange={handleInputChange}
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

export default UserEdition;
