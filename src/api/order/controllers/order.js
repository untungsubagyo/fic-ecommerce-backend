'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order',({strapi}) => ({
    async create(ctx){
        const result  = await super.create(ctx);

        const midtransClient = require('midtrans-client');
        // Create Snap API instance
        let snap = new midtransClient.Snap({
                isProduction : false,
                serverKey : 'SB-Mid-server-Hpu9AIIzO-293a3dAlDAi0NF',
                clientKey : 'SB-Mid-client-88MoJ8vFP_C9xLLk'
            });

        let parameter = {
            "transaction_details": {
                "order_id": result.data.id,
                "gross_amount": result.data.attributes.totalPrice
            }, "credit_card":{
                "secure" : true
            }
        };


        let response = await snap.createTransaction(parameter)
        // Create Core API instance
        // let core = new midtransClient.CoreApi({
        //         isProduction : false,
        //         serverKey : 'SB-Mid-server-Hpu9AIIzO-293a3dAlDAi0NF',
        //         clientKey : 'SB-Mid-client-88MoJ8vFP_C9xLLk'
        //     });

        // let parameter = {
        //     "payment_type": "bank_transfer",
        //     "transaction_details": {
        //         "gross_amount": result.data.attributes.totalPrice,
        //         "order_id": result.data.id,
        //     },
            
        // };

        // charge transaction
        // let response = await core.charge(parameter)
        return response
    }
}));
