import 'dotenv/config'
import * as joi from 'joi'

interface EnvVars { 
    PORT : number
    STRIPE_SECRET: string
}

const envsSchema = joi.object({
    PORT : joi.number().required(),
    STRIPE_SECRET : joi.string().required()
}).unknown(true);


const {error,value} = envsSchema.validate({
    ...process.env
})

if(error){
    throw new Error(`Configuracion de validación error: ${error.message}`)
}


const envVars : EnvVars = value;

export const envs = {
     port:envVars.PORT,
     stripe_secret:envVars.STRIPE_SECRET
}
