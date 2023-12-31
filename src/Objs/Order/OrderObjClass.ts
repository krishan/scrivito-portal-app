import { provideObjClass } from 'scrivito'

export const Order = provideObjClass('Order', {
  attributes: {
    billingAddress: 'string',
    createdAt: 'string',
    customerId: 'string',
    items: 'string',
    orderId: 'string',
    payment: 'string',
    pdfDownloadUrl: 'string',
    shippingId: 'string',
    total: 'string',
  },
})
