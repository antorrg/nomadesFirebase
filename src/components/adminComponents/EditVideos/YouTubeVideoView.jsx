import React, { useState, useEffect } from "react";
import { Container, Row, Col, Ratio, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as Arr from "../../../utils/SlickCarousel";
import { booleanState } from "../../../utils/generalHelpers";
import {deleteVideo } from "../../../Endpoints/endpoints"
import showConfirmationDialog from "../../../Endpoints/sweetAlert";

const YouTubeVideoView = ({ media }) => {
  const navigate = useNavigate();

  const videoList = media.filter((video) => video.type === "youtube");
  let videos = videoList[0] || {
    id: "0",
    title: "Videos de you tube",
    text: "Aguarde un momento...",
    url: "",
    enable: true,
  };

  const [isLoading, setIsLoading] = useState(true);
  const [mainVideo, setMainVideo] = useState(videos);

  useEffect(() => {
    if (isLoading && videoList.length > 0) {
      setMainVideo(videoList[0]);
      setIsLoading(false); // Marcar que ya no estamos cargando
    }
  }, [videoList, isLoading]);

  const handleVideoSelect = (video) => {
    setMainVideo(video);
  };

  const videoId = (url) => {
    const match = url.match(
      /(?:https?:\/\/(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/))([^\s&]+)/
    );
    return match ? match[1] : null;
  };
  //Borrar video:
  const delVideo = async (id) => {
    const confirmed = await showConfirmationDialog(
      "¿Está seguro de eliminar el item?"
    );
    if (confirmed) {
      // Aquí iría la lógica para actualizar el elemento

      await deleteVideo(id);
    }
  };
  return (
    <Container>
      {/* Video principal */}
      <Row className="featurette mt-5">
        <Col xs={12} md={5}>
          <Button
            className="mt-2 me-3 w-20"
            variant="outline-primary"
            size="sm"
            onClick={() => navigate("/admin/media/create?type=youtube")}
          >
            Crear
          </Button>
          <h2 className="featurette-heading fw-normal lh-1">
            {mainVideo.title}
          </h2>
          <p className="lead">{mainVideo.text}</p>
          <p className="lead">
            <strong>Estado: </strong> {booleanState(mainVideo.enable)}
          </p>
        </Col>
        <Col xs={12} md={7}>
          <Ratio aspectRatio="16x9">
            <iframe
              src={`https://www.youtube.com/embed/${videoId(mainVideo.url)}`}
              title={mainVideo.title}
              allowFullScreen
            />
          </Ratio>
        </Col>
      </Row>

      {/* Carrusel de miniaturas */}
      <Row className="mt-4">
        <Slider {...Arr.sliderSettings}>
          {videoList.map((video) => (
            <div key={video.id} className="p-2">
              <Ratio aspectRatio="16x9">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId(video.url)}`}
                  title={`Miniatura ${video.id}`}
                  allowFullScreen
                />
              </Ratio>
              <Button
                className="mt-2 me-3 w-20"
                variant="outline-success"
                size="sm"
                onClick={() => handleVideoSelect(video)}
              >
                Ver video
              </Button>
              <Button
                className="mt-2 me-3 w-20"
                variant="outline-primary"
                size="sm"
                onClick={() =>
                  navigate(`/admin/media/update/${video.id}?type=youtube`)
                }
              >
                Editar
              </Button>
              <Button
                className="mt-2 me-3 w-20"
                variant="outline-danger"
                size="sm"
                onClick={() => delVideo(video.id)}
              >
                Eliminar
              </Button>
            </div>
          ))}
        </Slider>
      </Row>
    </Container>
  );
};

export default YouTubeVideoView;
