import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('initiate')
  async initiatePayment(@Body() orderData: any, @Res() res: Response) {
    const apiResponse = await this.paymentService.initiatePayment(orderData);
    return res.json(apiResponse.GatewayPageURL);
  }

  @Post('validate')
  async validatePayment(@Query('val_id') valId: string) {
    return this.paymentService.validatePayment(valId);
  }

  @Post('success')
  async paymentSuccess(@Body() paymentData) {
    // Validate the payment
    const isValid = await this.validatePayment(paymentData.val_id);
    if (isValid) {
      // Update subscription status to active
      // Extend subscription validity
      return { message: 'Payment Successful', data: paymentData };
    } else {
      return { message: 'Payment validation failed' };
    }
  }

  @Post('fail')
  async paymentFail(@Body() paymentData) {
    // Handle failed payment
    return { message: 'Payment Failed' };
  }

  @Post('cancel')
  async paymentCancel(@Body() paymentData) {
    // Handle canceled payment
    return { message: 'Payment Canceled' };
  }

  @Post('ipn')
  async ipnCallback(@Body() body: any) {
    // Handle IPN callback
    return { message: 'IPN received', data: body };
  }

}
