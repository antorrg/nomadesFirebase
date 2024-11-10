import dotenv from 'dotenv'
const envFile = process.env.NODE_ENV==='development'? '.env.development' : process.env.NODE_ENV==='test'? '.env.test' : process.env.NODE_ENV==='preview'? '.env.development': '.env';
dotenv.config({ path:envFile })

const {PORT, SECRET_KEY, DB_USER,  DB_PASSWORD,  DB_HOST,  DB_NAME, RENDER_DB, USER_IMG, GMAIL_USER, GMAIL_APP_PASS, S_USER_EMAIL,
    S_USER_PASS, DEFAULT_PASS}=process.env;

const LocalDb = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`

const firebaseConfig = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  };

export default {
 Port: PORT,
 Status: process.env.NODE_ENV==='development'? 'development' : process.env.NODE_ENV==='test'? 'testing': process.env.NODE_ENV==='preview'? 'preview' :'production',
 ConnectDb : process.env.NODE_ENV==='development'? LocalDb :process.env.NODE_ENV==='production'? RENDER_DB : LocalDb,
 optionRender: process.env.NODE_ENV==='production'? true : false,
 SecretKey: SECRET_KEY,
 UserEmail : S_USER_EMAIL,
 UserPass : S_USER_PASS,
 userImg: USER_IMG,
 defaultPass : DEFAULT_PASS,
 gmailUser: GMAIL_USER,
 gmailPass: GMAIL_APP_PASS,
 //variables firebase:
 firebaseConfig,
 storageBucket: process.env.STORAGE_BUCKET


}

