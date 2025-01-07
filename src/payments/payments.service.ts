import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {


    private readonly stripe = new Stripe(envs.stripe_secret)

   async createPaymentSession(paymentSessionDto : PaymentSessionDto){

        const {currency, items, orderId } = paymentSessionDto;

        const lineItems = items.map((item)=> { 
            return   {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: item.name
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity

            }
        })

        const session = await this.stripe.checkout.sessions.create({
            //Todo : Colocar aqui el ID de la orden
            payment_intent_data: {
                metadata: {
                    orderId: orderId
                }
            },

            line_items:lineItems,
            mode: 'payment',
            success_url: envs.stripeSuccessURL,
            cancel_url: envs.stripeCancelURL

        });
        return session;
    }

    async stripeWebhook(req:Request, res: Response) {
        const signature = req.headers['stripe-signature'];
        let event : Stripe.Event;
        // const endpointSecret = 'whsec_fffa6371ffca0fa8c4115f58c126c29d442bf41880fbfbfe697329b5d2d63854';
        const endpointSecret = envs.stripeEndpointSecret;
        try {
            event = this.stripe.webhooks.constructEvent(req['rawBody'],signature,endpointSecret)
        } catch (err) {
            res.status(400).send(`⚠️  Webhook signature verification failed.${ err.message}`)
            return ;
        }

        switch(event.type){
            case 'charge.succeeded':
                const chargeSucceeded = event.data.object;
                //Todo: llamar a nuestro microservicio
                console.log({
                    metadata : chargeSucceeded.metadata,
                    orderId : chargeSucceeded.metadata.orderId
                });
            break;

            default:
                    console.log(`Event ${event.type} not handled` )
        }


        return  res.status(200).json({signature});

    }

}
