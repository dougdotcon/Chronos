import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { StripeService } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { amount, currency = 'brl' } = body

    // Validate amount
    if (!amount || amount < 10 || amount > 10000) {
      return NextResponse.json(
        { error: 'Invalid amount. Must be between R$ 10 and R$ 10,000' },
        { status: 400 }
      )
    }

    // Create or get Stripe customer
    const customer = await StripeService.createCustomer(
      session.user.email!,
      session.user.name || undefined,
      {
        userId: session.user.id,
        platform: 'chronos'
      }
    )

    // Create payment intent
    const paymentIntent = await StripeService.createPaymentIntent(
      amount,
      currency,
      customer.id,
      {
        userId: session.user.id,
        userEmail: session.user.email!,
        type: 'deposit'
      }
    )

    return NextResponse.json({
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.id,
      customerId: customer.id
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
