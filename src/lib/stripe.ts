import Stripe from 'stripe'

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  clientSecret: string
}

export interface StripeCustomer {
  id: string
  email: string
  name?: string
  metadata?: Record<string, string>
}

export class StripeService {
  // Create payment intent for deposits
  static async createPaymentIntent(
    amount: number,
    currency: string = 'brl',
    customerId?: string,
    metadata?: Record<string, string>
  ): Promise<PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        customer: customerId,
        metadata: {
          type: 'deposit',
          platform: 'chronos',
          ...metadata
        },
        automatic_payment_methods: {
          enabled: true,
        },
      })

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        clientSecret: paymentIntent.client_secret!
      }
    } catch (error) {
      console.error('Error creating payment intent:', error)
      throw new Error('Failed to create payment intent')
    }
  }

  // Create or retrieve Stripe customer
  static async createCustomer(
    email: string,
    name?: string,
    metadata?: Record<string, string>
  ): Promise<StripeCustomer> {
    try {
      // Check if customer already exists
      const existingCustomers = await stripe.customers.list({
        email,
        limit: 1
      })

      if (existingCustomers.data.length > 0) {
        const customer = existingCustomers.data[0]
        return {
          id: customer.id,
          email: customer.email!,
          name: customer.name || undefined,
          metadata: customer.metadata
        }
      }

      // Create new customer
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          platform: 'chronos',
          ...metadata
        }
      })

      return {
        id: customer.id,
        email: customer.email!,
        name: customer.name || undefined,
        metadata: customer.metadata
      }
    } catch (error) {
      console.error('Error creating customer:', error)
      throw new Error('Failed to create customer')
    }
  }

  // Get payment intent status
  static async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        clientSecret: paymentIntent.client_secret!
      }
    } catch (error) {
      console.error('Error retrieving payment intent:', error)
      throw new Error('Failed to retrieve payment intent')
    }
  }

  // Create setup intent for saving payment methods
  static async createSetupIntent(customerId: string): Promise<{ clientSecret: string }> {
    try {
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
        usage: 'off_session'
      })

      return {
        clientSecret: setupIntent.client_secret!
      }
    } catch (error) {
      console.error('Error creating setup intent:', error)
      throw new Error('Failed to create setup intent')
    }
  }

  // List customer payment methods
  static async getCustomerPaymentMethods(customerId: string) {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card'
      })

      return paymentMethods.data.map(pm => ({
        id: pm.id,
        type: pm.type,
        card: pm.card ? {
          brand: pm.card.brand,
          last4: pm.card.last4,
          expMonth: pm.card.exp_month,
          expYear: pm.card.exp_year
        } : null
      }))
    } catch (error) {
      console.error('Error retrieving payment methods:', error)
      throw new Error('Failed to retrieve payment methods')
    }
  }

  // Process refund
  static async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string
  ): Promise<{ id: string; status: string; amount: number }> {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason: reason as any,
        metadata: {
          platform: 'chronos',
          refund_reason: reason || 'requested_by_customer'
        }
      })

      return {
        id: refund.id,
        status: refund.status,
        amount: refund.amount / 100
      }
    } catch (error) {
      console.error('Error creating refund:', error)
      throw new Error('Failed to create refund')
    }
  }

  // Handle webhook events
  static async handleWebhook(
    payload: string,
    signature: string,
    endpointSecret: string
  ): Promise<Stripe.Event> {
    try {
      const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret)
      
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)
          break
        
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent)
          break
        
        case 'customer.created':
          await this.handleCustomerCreated(event.data.object as Stripe.Customer)
          break
        
        default:
          console.log(`Unhandled event type: ${event.type}`)
      }

      return event
    } catch (error) {
      console.error('Error handling webhook:', error)
      throw new Error('Webhook signature verification failed')
    }
  }

  // Private webhook handlers
  private static async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    console.log('Payment succeeded:', paymentIntent.id)
    
    // Update user balance in database
    const userId = paymentIntent.metadata?.userId
    const amount = paymentIntent.amount / 100

    if (userId) {
      // In a real implementation, update the database
      console.log(`Adding ${amount} to user ${userId} balance`)
      
      // Send confirmation email
      // await emailService.sendDepositConfirmation(userId, amount)
      
      // Send push notification
      // await pushNotificationService.notifyDepositConfirmed(amount)
    }
  }

  private static async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    console.log('Payment failed:', paymentIntent.id)
    
    const userId = paymentIntent.metadata?.userId
    const amount = paymentIntent.amount / 100

    if (userId) {
      // Log failed payment
      console.log(`Payment failed for user ${userId}: ${amount}`)
      
      // Send failure notification
      // await emailService.sendPaymentFailureNotification(userId, amount)
    }
  }

  private static async handleCustomerCreated(customer: Stripe.Customer) {
    console.log('Customer created:', customer.id)
    
    // Update user record with Stripe customer ID
    const userId = customer.metadata?.userId
    if (userId) {
      console.log(`Linking Stripe customer ${customer.id} to user ${userId}`)
      // await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customer.id } })
    }
  }

  // Get payment statistics
  static async getPaymentStats(customerId?: string) {
    try {
      const charges = await stripe.charges.list({
        customer: customerId,
        limit: 100
      })

      const successful = charges.data.filter(charge => charge.status === 'succeeded')
      const failed = charges.data.filter(charge => charge.status === 'failed')
      
      const totalAmount = successful.reduce((sum, charge) => sum + charge.amount, 0) / 100
      const averageAmount = successful.length > 0 ? totalAmount / successful.length : 0

      return {
        totalTransactions: charges.data.length,
        successfulTransactions: successful.length,
        failedTransactions: failed.length,
        totalAmount,
        averageAmount,
        successRate: charges.data.length > 0 ? (successful.length / charges.data.length) * 100 : 0
      }
    } catch (error) {
      console.error('Error getting payment stats:', error)
      throw new Error('Failed to get payment statistics')
    }
  }

  // Create subscription for recurring payments
  static async createSubscription(
    customerId: string,
    priceId: string,
    metadata?: Record<string, string>
  ) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          platform: 'chronos',
          ...metadata
        }
      })

      return {
        id: subscription.id,
        status: subscription.status,
        clientSecret: (subscription.latest_invoice as Stripe.Invoice)?.payment_intent?.client_secret
      }
    } catch (error) {
      console.error('Error creating subscription:', error)
      throw new Error('Failed to create subscription')
    }
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.cancel(subscriptionId)
      return {
        id: subscription.id,
        status: subscription.status,
        canceledAt: subscription.canceled_at
      }
    } catch (error) {
      console.error('Error canceling subscription:', error)
      throw new Error('Failed to cancel subscription')
    }
  }
}
