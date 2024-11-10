import {useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import {getWorks} from '../redux/actions'
import {Header} from '../components/IndexComponents'

const OurWork = () => {
  const dispatch = useDispatch();
  const featurettes = useSelector((state) => state.Works);

  useEffect(()=>{
    dispatch(getWorks())
  },[])

  return (
    <div className="imageBack">
    <Header />
    <div className="container coverAbout">
      <div className="caption-nav">
        <h2 className="about-h1">Nuestro trabajo:</h2>
      </div>
     <div className="aboutContainer colorBack rounded-4 shadow">
      <div className="modal-content p-2">
        {featurettes?.map((item, index) => (
          <div key={index}>
            <div className="row featurette">
              {/* Alterna el orden usando order-md-2 solo en imágenes impares */}
              <div className={`col-md-7 ${index % 2 !== 0 ? 'order-md-2' : ''}`}>
                <h2 className="featurette-heading fw-normal lh-1">{item.title}</h2>
                <p className="lead">{item.text}</p>
              </div>
              <div className={`col-md-5 ${index % 2 !== 0 ? 'order-md-1' : ''}`}>
                <img
                  className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto mt-3"
                  src={item.image}
                  alt="Not found"
                />
              </div>
            </div>
            <hr className="featurette-divider" />
          </div>
        ))}
      </div>
    </div>
    </div>
  </div>
    
  )
}

export default OurWork