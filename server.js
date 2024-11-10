//* oooooooooooo  o8o                      .o8                                                             
//* `888'     `8  `"'                     "888                                                  
//*  888         oooo  oooo d8b  .ooooo.   888oooo.   .oooo.    .oooo.o  .ooooo.      
//*  888oooo8    `888  `888""8P d88' `88b  d88' `88b `P  )88b  d88(  "8 d88' `88b    
//*  888    "     888   888     888ooo888  888   888  .oP"888  `"Y88b.  888ooo888   
//*  888          888   888     888    .o  888   888 d8(  888  o.  )88b 888    .o.  
//* o888o        o888o d888b    `Y8bod8P'  `Y8bod8P' `Y888""8o 8""888P' `Y8bod8P'  
//                                                                               
//                                                                               
//? ooooo      ooo                                             .o8                    
//? `888b.     `8'                                            "888                    
//?  8 `88b.    8   .ooooo.  ooo. .oo.  .oo.    .oooo.    .oooo888   .ooooo.   .oooo.o
//?  8   `88b.  8  d88' `88b `888P"Y88bP"Y88b  `P  )88b  d88' `888  d88' `88b d88(  "8
//?  8     `88b.8  888   888  888   888   888   .oP"888  888   888  888ooo888 `"Y88b. 
//?  8       `888  888   888  888   888   888  d8(  888  888   888  888    .o o.  )88b
//? o8o        `8  `Y8bod8P' o888o o888o o888o `Y888""8o `Y8bod88P" `Y8bod8P' 8""888P'

//todo::::::::: Desplegada el dia 10/10/2024 ::::::::::::::::::::::::::::::::::::::::::::::::::


import server from './server/app.js';
import env from './server/envConfig.js'
//import initialUser from './server/services/initialUser.js'
const port = env.Port? env.Port : 4000

server.listen(port, async()=>{
    try {
        //await initialUser()
        console.log(`Server is listening at http://localhost:${port}\nServer in ${env.Status}`)
    } catch (error) {
        console.error('Error conectando a firebase: ',error)
    }
})
