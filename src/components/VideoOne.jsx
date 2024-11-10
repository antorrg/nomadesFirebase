import React from 'react';
import { Container, Row, Col, Ratio } from 'react-bootstrap';


const VideoOne = () => {
 
  return (
    <Container>
      <Row className="featurette">
        <Col xs={12} md={5}>
          <h2 className="featurette-heading fw-normal lh-1">
            Este seria un apartado de video.
          </h2>
          <p className="lead">
            Algun video de YouTube que pueda describir y llamar la atencion del
            cliente con la publicacion acerca de las cabañitas.
          </p>
        </Col>
        <Col xs={12} md={7}>
          {/* Contenedor responsivo usando Ratio */}
          <Ratio aspectRatio="16x9">
            <iframe
              src="https://www.youtube.com/embed/oRH5lH7F7TY"
              title="YouTube video"
              allowFullScreen
            />
          </Ratio>
        </Col>
      </Row>
    </Container>
    // <div className='container'>
    //     VideoOne
    //     <div className="row featurette">
    //   <div className="col-md-5">
    //     <h2 className="featurette-heading fw-normal lh-1">Este seria un apartado de video.</h2>
    //     <p className="lead">Algun video de youtube que pueda describir y llamar la atencion del cliente con la publicacion acerca de las cabañitas.</p>
    //   </div>
    //   <div className="col-sm-12 col-md-7">
    //     <div className="video-responsive">
    //       <YouTube videoId="oRH5lH7F7TY" opts={opts} onReady={onReady} />
    //     </div>
    //   </div>
    // </div>
    // </div>
  )
}

export default VideoOne