Para ayudarte a manejar el estado en el componente `ProductEdition`, te sugiero hacer los siguientes ajustes para asegurar que los valores del formulario se actualicen correctamente y que el `ImageUploader` funcione de manera sincronizada con el estado del producto.

### Problema Actual:
El problema parece estar en cómo se manejan los cambios en los campos de entrada. Actualmente, el `handleInputChange` está pasando solo el `name` y el `value` sin realmente actualizar el `product`.

### Solución:
1. **Ajustar el manejo de los cambios en los inputs**: Cambia el `handleInputChange` para que reciba el evento y lo procese correctamente.
2. **Sincronizar correctamente `product` con `page.info` al cargar los datos**: Usa `useEffect` para actualizar el estado de `product` cuando `page.info` esté disponible.

### Cambios sugeridos en `ProductEdition`:

```jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../../../redux/actions";
import "./productstyle.css";
import ImageUploader from "../../AdminComponents/ImageUploader";

const ProductEdition = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const page = useSelector((state) => state.ProductId);

  // Sincroniza el estado con la info del producto cuando la info esté disponible
  const [product, setProduct] = useState({
    title: "",
    landing: "",
    infoHeader: "",
    infoBody: "",
    enable: false,
  });

  useEffect(() => {
    dispatch(getProductById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (page.info) {
      setProduct({
        title: page.info.title || "",
        landing: page.info.landing || "",
        infoHeader: page.info.infoHeader || "",
        infoBody: page.info.infoBody || "",
        enable: page.info.enable || false,
      });
    }
  }, [page.info]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleImageChange = (imageUrl) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      landing: imageUrl,
    }));
  };

  const handleSubmit = () => {
    // Lógica para actualizar el producto
    console.log("Producto actualizado:", product);
  };

  return (
    <div className="imageBack">
      <div className="coverBack">
        <div className="container-md modal-content colorBack formProductContainer rounded-4 shadow">
          <div className="container mt-5">
            <h1>Actualización de producto</h1>
            <section className="needs-validation" id="updateForm" noValidate>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <ImageUploader
                    titleField={"Imagen portada:"}
                    imageValue={product.landing}
                    onImageUpload={handleImageChange}
                  />
                </div>
                <div className="col-md-6 mb-3"></div>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Título:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="title"
                    name="title"
                    value={product.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="infoHeader" className="form-label">
                    Info posicionamiento:
                  </label>
                  <textarea
                    className="form-control"
                    id="infoHeader"
                    name="infoHeader"
                    rows="3"
                    value={product.infoHeader}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="infoBody" className="form-label">
                    Descripción:
                  </label>
                  <textarea
                    className="form-control"
                    id="infoBody"
                    name="infoBody"
                    rows="3"
                    value={product.infoBody}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="enable" className="form-label">
                    Mostrar al público
                  </label>
                  <select
                    className="form-select"
                    id="enable"
                    name="enable"
                    value={product.enable ? "true" : "false"}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
                <div className="d-flex flex-row me-3">
                  <button
                    className="btn btn-primary mb-3 me-2"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Actualizar
                  </button>
                  <button
                    className="btn btn-primary mb-3"
                    onClick={() => {
                      navigate(-1);
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

export default ProductEdition;
```

### Cambios claves:

1. **Sincronización de `product` con `page.info`**: Ahora, cuando `page.info` cambie, `product` también se actualizará con los valores del producto.
2. **`handleInputChange`**: El controlador de cambios para los inputs ahora recibe el evento (`e`) y actualiza correctamente el estado basado en el nombre del campo (`name`) y su valor (`value`).
3. **`handleImageChange`**: Este nuevo método se pasa al componente `ImageUploader` para que actualice el campo `landing` del estado `product` con la URL de la imagen cargada.
4. **`handleSubmit`**: Se puede agregar la lógica aquí para enviar los datos actualizados del producto al servidor.

Con estos cambios, el componente debería manejar mejor los estados y permitir la actualización de los campos del formulario.