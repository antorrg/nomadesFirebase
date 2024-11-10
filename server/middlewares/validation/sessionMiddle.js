import crypto from 'crypto'
import pkg from 'jsonwebtoken'
import env from '../../envConfig.js';
import eh from '../../utils/errorHandlers.js'


//! Esta parte corresponde a jsonwebtoken: 


//Estas funciones no se exportan porque intervienen en la confeccion de jsonwebtoken
const disguiseRole = (role, position)=>{
    //Generar cadena aleatoria de 20 caracteres
    const generateSecret = () => {
    return crypto.randomBytes(10).toString('hex')};

    const str = generateSecret()
    if (position < 0 || position >= str.length) {
        throw new Error('Posición fuera de los límites de la cadena')}
        // Convertir el número a string
        const replacementStr = role.toString();
        // Crear la nueva cadena con el reemplazo
        return str.slice(0, position) + replacementStr + str.slice(position + 1);
}
        
const recoveryRole = (str, position)=>{
    if (position < 0 || position >= str.length) {
    throw new Error('Posición fuera de los límites de la cadena')}
    // Recuperar el carácter en la posición especificada
    const recover = str.charAt(position);
    return parseInt(recover)
}

//En recoveryRole str es el dato entrante (string)


export const generateToken = (user)=>{
        const intData = disguiseRole(user.role, 5)
        //console.log('estoy en el token: ', expiresIn)
        const token = pkg.sign({userId: user.id, email:user.email, internalData:intData}, env.SecretKey, {expiresIn: '30m'});
        return token;
    };
export const verifyToken = (req, res, next)=>{
     let token = req.headers['x-access-token'] || req.headers.authorization;
            if(!token){eh.throwError('Acceso no autorizado. Token no proporcionado', 401)}
            if (token.startsWith('Bearer')) {
            // Eliminar el prefijo 'Bearer ' del token
            token = token.slice(7, token.length);
              }
            pkg.verify(token, env.SecretKey, (err, decoded)=>{
            if(err){
                if(err.name === 'TokenExpiredError'){eh.throwError('Token expirado', 401)
                }eh.throwError('Token invalido', 401)
            }
            req.user = decoded;
            const userId = decoded.userId;
            const userRole= recoveryRole(decoded.internalData, 5);
            req.userInfo = {userId, userRole}
            //console.log('userInfo: ', req.user.userId, )
            //console.log('soy role : ', req.user.role)
            next();

        })
       
    };
export const checkRole = (allowedRoles) => {
        return (req, res, next) => {
          const {userRole}= req.userInfo;
          //const userRole = req.user.role; // asumiendo que el rol está en req.user después de la autenticación
      
          if (allowedRoles.includes(userRole)) {
            // El usuario tiene el rol necesario, permitir el acceso
            next();
          } else {
            // El usuario no tiene el rol necesario, rechazar la solicitud
            eh.throwError('Acceso no autorizado', 403)
          }
        };
      };

//Este es un modelo de como recibe el parámetro checkRole:
  //todo   app.get('/ruta-protegida', checkRole(['admin']), (req, res) => {





// import session from 'express-session';
// import  connectMongo from 'connect-mongodb-session'
// import env from '../../envConfig.js';
// const MongoDBStore = connectMongo(session);

// export const myStore = new MongoDBStore({
//     uri:env.DbUri,
//     autoReconnect: true,
//     collection: 'sessions', // Nombre de la colección donde se guardarán las sesiones
//     autoRemove: 'interval', // Eliminar automáticamente las sesiones expiradas
//     autoRemoveInterval: 10, // Intervalo en minutos para eliminar las sesiones expiradas
//     touchAfter: 24 * 3600 // Tiempo en segundos después del cual se actualiza la fecha de acceso de la sesión
// });

// myStore.on('error', (error) => {
//     console.error(error);
//   });

// export const sessionMiddle = session({
//     secret: env.Secret,
//     resave: false,
//     saveUninitialized: false,
//     store: myStore,
//     cookie: {
//         secure: false,
//         httpOnly: true,
//         sameSite: 'strict',
//         maxAge: 1000 * 60 * 60
//     }
// });


