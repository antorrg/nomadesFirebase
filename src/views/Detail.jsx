import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getProductById} from "../redux/actions";
import * as Cmt from "../components/IndexComponents";

const Detail = () => {
  const dispatch = useDispatch();
  const response = useSelector((state) => state.ProductId);
  const info = response.info;
  const items = response.items;
  const { id } = useParams();
   
  useEffect(() => {
    dispatch(getProductById(id));
   
  }, [id, dispatch]);
  return (
    <div>
      <Cmt.Header />
     <Cmt.Album info={info} items={items}/>
      <Cmt.Footer />
    </div>
  );
};

export default Detail;
