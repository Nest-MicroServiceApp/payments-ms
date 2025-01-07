import 'dotenv/config'
import * as joi from 'joi'

interface EnvVars {
  PORT: number;
  STRIPE_SECRET: string;
  STRIPE_SUCCESS_URL: string;
  STRIPE_CANCEL_URL: string;
  STRIPE_ENPOINT_SECRET: string;
}

const envsSchema = joi.object({
    PORT : joi.number().required(),
    STRIPE_SECRET : joi.string().required(),
    STRIPE_SUCCESS_URL : joi.string().required(),
    STRIPE_CANCEL_URL : joi.string().required(),
    STRIPE_ENPOINT_SECRET : joi.string().required()
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
     stripe_secret:envVars.STRIPE_SECRET,
     stripeSuccessURL : envVars.STRIPE_SUCCESS_URL,
     stripeCancelURL : envVars.STRIPE_CANCEL_URL,
     stripeEndpointSecret : envVars.STRIPE_ENPOINT_SECRET
}
