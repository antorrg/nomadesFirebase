import { login, createUser } from './ClassesFunctions/firebaseAuth'
import {getLanding, getProduct, getProductByid, getItem} from './services/service'





export default {
    user:{login, createUser,},
    landing: {getLanding, },
    product: {getProduct, getProductByid},
    item: {getItem}
}
