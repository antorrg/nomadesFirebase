import './carouselStyle.css'
import { Carousel } from 'react-bootstrap';



const MyCarousel = ({ info }) => {
  return (
    <Carousel>
      {info?.map((item, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100"
            src={item.landing}
            alt={item.title}
          />
          <Carousel.Caption className='carousel-caption'>
            <h2 className='h3'>{item.title}</h2>
            <p>{item.infoHeader}</p>
            <p>
              <a className="btn btn-lg btn-ligth fw-bold border-white bg-white" href={`/detalle/${item.id}`} rel="noreferrer">
                Vea mas...
              </a>
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default MyCarousel;
// const Carousel = ({ info }) => {
//   return (
//     <section className="carousel-section">
//       <div className="container-fluid">
//         <div id="myCarousel" className="carousel slide" data-bs-ride="carousel">
//           {/* Indicadores del carrusel */}
//           <div className="carousel-indicators">
//             {info.map((val, index) => (
//               <button
//                 key={index}
//                 type="button"
//                 data-bs-target="#myCarousel"
//                 data-bs-slide-to={index}
//                 className={index === 0 ? 'active' : ''}
//                 aria-current={index === 0 ? 'true' : ''}
//                 aria-label={`Slide ${index + 1}`}
//               />
//             ))}
//           </div>

//           {/* Elementos del carrusel */}
//           <div className="carousel-inner">
//             {info.map((val, index) => (
//               <div
//                 key={index}
//                 className={`carousel-item ${index === 0 ? 'active' : ''}`}
//               >
//                 <img
//                   src={val.landing}
//                   className="d-block w-100"
//                   alt={val.title}
//                 />
//                 <div className="container">
//                   <div
//                     className={`carousel-caption ${
//                       index === 0
//                         ? 'text-start'
//                         : index === info.length - 1
//                         ? 'text-end'
//                         : ''
//                     }`}
//                   >
//                     <h1>{val.title}</h1>
//                     <p>{val.infoHeader}</p>
//                     <p>
//                       <a
//                         className="btn btn-lg btn-primary"
//                         href={val.url}
//                         target="_blank"
//                         rel="noreferrer"
//                       >
//                         Visite el sitio
//                       </a>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Controles del carrusel */}
//           <button
//             className="carousel-control-prev"
//             type="button"
//             data-bs-target="#myCarousel"
//             data-bs-slide="prev"
//           >
//             <span className="carousel-control-prev-icon" aria-hidden="true" />
//             <span className="visually-hidden">Previous</span>
//           </button>
//           <button
//             className="carousel-control-next"
//             type="button"
//             data-bs-target="#myCarousel"
//             data-bs-slide="next"
//           >
//             <span className="carousel-control-next-icon" aria-hidden="true" />
//             <span className="visually-hidden">Next</span>
//           </button>
//         </div>
//       </div>
//     </section>
  



//   )
// }

// export default Carousel
