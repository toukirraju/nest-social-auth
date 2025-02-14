import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import * as SSLCommerzPayment from 'sslcommerz-lts';

@Injectable()
export class PaymentService {
  private sslcommerz: SSLCommerzPayment;

  constructor() {
    this.sslcommerz = new SSLCommerzPayment(
      process.env.SSLCOMMERZ_STORE_ID,
      process.env.SSLCOMMERZ_STORE_PASSWORD,
      process.env.NODE_ENV === 'production',
    );
  }

  async initiatePayment(orderData: any) {
    const paymentData = {
      total_amount: orderData.totalAmount,
      currency: 'BDT',
      tran_id: nanoid(10), // use unique tran_id for each API call
      success_url: `${process.env.BASE_FRONTEND_URL}/payment/success`,
      fail_url: `${process.env.BASE_FRONTEND_URL}/payment/fail`,
      cancel_url: `${process.env.BASE_FRONTEND_URL}/payment/cancel`,
      ipn_url: `${process.env.BASE_FRONTEND_URL}/payment/ipn`,
      shipping_method: 'NO',
      product_name: orderData.productName,
      product_category: 'topup',
      product_profile: 'general',
      cus_name: orderData.customerName,
      cus_email: orderData.customerEmail,
      // cus_add1: orderData.cus_add1,
      // cus_add2: orderData.cus_add2,
      // cus_city: orderData.cus_city,
      // cus_state: orderData.cus_state,
      // cus_postcode: orderData.cus_postcode,
      // cus_country: orderData.cus_country,
      cus_phone: orderData.customerPhone,
      // cus_fax: orderData.cus_fax,
      // ship_name: orderData.ship_name,
      // ship_add1: orderData.ship_add1,
      // ship_add2: orderData.ship_add2,
      // ship_city: orderData.ship_city,
      // ship_state: orderData.ship_state,
      // ship_postcode: orderData.ship_postcode,
      // ship_country: orderData.ship_country,
    };

    try {
      const apiResponse = await this.sslcommerz.init(paymentData);
      return apiResponse;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async validatePayment(valId: string) {
    try {
      const response = await this.sslcommerz.validate({ val_id: valId });
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}