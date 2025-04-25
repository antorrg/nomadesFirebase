import {useEffect} from 'react'
import { Helmet } from 'react-helmet-async';
import {useDispatch, useSelector} from 'react-redux'
import {getLanding, getPubMedia} from '../redux/actions'
import {Header, FacebookVideo, InstagramVideo, YouTubeVideo, Footer, } from '../components/IndexComponents'


const Videos = () => {
  const dispatch = useDispatch()
  const info = useSelector((state)=>state.LandingPublic)
  const media = useSelector((state)=>state.MediaPublic)
  useEffect(()=>{
    dispatch(getLanding())
    dispatch(getPubMedia())
  },[])
  

  return (
    <>
    <div className="imageBack">
     <Helmet>
        <title>Nomades Cabañas de pastores</title>
        <meta name="description" content={info.info_header} />
        <meta name="keywords" content="cabañas, pastores, vagon" />
        {/* Puedes agregar más etiquetas meta aquí */}
      </Helmet>
    <Header/>
    <div className="container coverAbout">
      <div className="caption-nav mb-2">
        <h2 className="about-h1">Videos:</h2>
      </div>
      <div className=" container-fluid colorBack rounded-4 shadow">
    <section>
    <h2 className="videoTitle fw-normal lh-lg">Publicaciones de Facebook:</h2>
      <FacebookVideo media={media}/>
      <hr></hr>
    </section>
    <section>
    <h2 className="videoTitle fw-normal lh-lg">Publicaciones de Instagram:</h2>
      <InstagramVideo media={media}/>
      <hr></hr>
    </section>
    <section>
    <h2 className="videoTitle fw-normal lh-lg">Videos de You Tube:</h2>
      <YouTubeVideo media={media}/>
    </section>
    </div>
    </div>
    </div>
    <Footer/>
    </> 
    
  )
}

export default Videos
