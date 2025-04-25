import {
    PUB_LANDING,
    PUB_PRODUCT,
    PUB_PROD_ID,
    PUB_ITEM,
    PUB_MEDIA,
    PUB_WORKS,
    PUB_CLEAN,
    CONTACT,
//Admin
    LANDING,
    LANDING_BY_ID,
    PRODUCT,
    PRODUCT_BY_ID,
    CLEAN_STATE,
    ITEM,
    ALL_USERS,
    USER_BY_ID,
    IMAGES,
    WORKS,
    WORK_BY_ID,
    MEDIA,
    MEDIA_AD,
    MEDIA_BY_ID

} from './actions'

const initialState = {
    LandingPublic:[],
    ProductsPublic:[],
    ProductIdPublic:[],
    ItemPublic:[],
    MediaPublic: [],
    WorksPublic: [],
    contactStatus: [],
//Protected States:
    Landing:[],
    LandingById: [],
    Products:[],
    ProductId:[],
    Item:[],
    Media: [],
    Users:[],
    UserById: [],
    Images : [],
    Works : [],
    WorkById: [],
    MediaAd:[],
    MediaById:[],

}

const reducer = (state = initialState, {type, payload})=>{
    switch(type){
    //Public cases:
        case PUB_LANDING:
            return {
                ...state,
                LandingPublic: payload,
            }
        case PUB_PRODUCT:
            return {
                ...state,
                ProductsPublic: payload,
            }
        case PUB_PROD_ID:
            return {
                ...state,
                ProductIdPublic:payload,
            }
        case PUB_ITEM:
            return {
                ...state,
                ItemPublic:payload
            }
        case PUB_WORKS : 
            return {
                ...state,
                WorksPublic: payload,
            }
        case PUB_MEDIA:
            return {
                ...state,
                MediaPublic: payload,
            }
        case PUB_CLEAN:
            return {
                ...state,
                ProductIdPublic: [],
                ItemPublic:      [],
                contactStatus: []
            }
        case CONTACT: 
            return {
                ...state,
                contactStatus: payload
            }      
     //Admin cases
        case LANDING:
            return {
                ...state,
                Landing: payload,
            }
        case LANDING_BY_ID:
            return {
                ...state,
                LandingById: payload,
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
        case MEDIA:
            return {
                ...state,
                Media: payload,
            }
        case MEDIA_AD:
            return {
                ...state,
                MediaAd: payload,
            }
        case MEDIA_BY_ID:
            return {
                ...state,
                MediaById: payload,
            }
        case CLEAN_STATE:
            return {
                ...state,
                Item: [],
                ProductId:[],
                UserById: [],
                WorkById : [],
                LandingById : [],
                MediaAd: [],
                MediaById:[]
            }                   
        default:
            return {
                ...state,
            }
    }
}

export default reducer