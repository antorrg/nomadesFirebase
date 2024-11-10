import {
    LANDING,
    PRODUCT,
    PRODUCT_BY_ID,
    CLEAN_STATE,
    ITEM,
    ALL_USERS,
    USER_BY_ID,
    IMAGES,
    WORKS,
    WORK_BY_ID,
    ABOUT

} from './actions'

const initialState = {
    Landing:[],
    Products:[],
    ProductId:[],
    Item:[],
    Users:[],
    UserById: [],
    Images : [],
    Works : [],
    WorkById: [],
    About: [],

}

const reducer = (state = initialState, {type, payload})=>{
    switch(type){
        case LANDING:
            return {
                ...state,
                Landing: payload,
            }
        case PRODUCT:
            return {
                ...state,
                Products: payload,
            }
        case PRODUCT_BY_ID:
            return {
                ...state,
                ProductId:payload,
            }
        case ITEM:
            return {
                ...state,
                Item:payload
            }
        case ALL_USERS: 
            return {
                ...state,
                Users: payload,
            }
        case USER_BY_ID:
            return {
                ...state,
                UserById: payload,
            }
        case CLEAN_STATE:
            return {
                ...state,
                Item:payload,
                ProductId:payload,
                UserById: payload,
                WorkById : payload,
            }
        case IMAGES:
            return {
                ...state,
                Images: payload,
            }
        case WORKS : 
            return {
                ...state,
                Works : payload,
            }
        case WORK_BY_ID:
            return {
                ...state,
                WorkById : payload,
            }
        case ABOUT:
            return {
                ...state,
                About: payload,
            }
        default:
            return {
                ...state,
            }
    }
}

export default reducer