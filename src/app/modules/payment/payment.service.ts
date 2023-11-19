// payment.service.ts

import Stripe from 'stripe';

const DOMAIN = 'http://localhost:3000'; // Update this with your actual domain

const stripeApiKey =
  'sk_test_51O7I6YSHcqDbqznpDeLVhjkm8daLBzB8UiImRJowGCFLzK8WBj3R2CbT1HlK8SZr9zmVWMET9Xua9PPMX1m4LwMw00j9tQGxQg';

const stripe = new Stripe(stripeApiKey);

const createCheckoutSession = async (product: any) => {
  try {
    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: [product.image],
            metadata: {
              id: product._id,
            },
          },
          unit_amount: product.price * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${DOMAIN}/payment/success`,
      cancel_url: `${DOMAIN}/payment/cancel`,
    });

    console.log(session);

    return {
      sessionId: session.id,
      sessionUrl: session.url,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const PaymentService = {
  createCheckoutSession,
};
