import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type')?.toLowerCase() ?? '';
    let paymentId: string | null = null;
    let orderId: string | null = null;
    let signature: string | null = null;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      paymentId = formData.get('razorpay_payment_id')?.toString() ?? null;
      orderId = formData.get('razorpay_order_id')?.toString() ?? null;
      signature = formData.get('razorpay_signature')?.toString() ?? null;
    } else {
      const json = await request.json().catch(() => ({}));
      paymentId = typeof json?.razorpay_payment_id === 'string' ? json.razorpay_payment_id : null;
      orderId = typeof json?.razorpay_order_id === 'string' ? json.razorpay_order_id : null;
      signature = typeof json?.razorpay_signature === 'string' ? json.razorpay_signature : null;
    }

    paymentId = paymentId?.trim() || null;

    if (!paymentId) {
      return NextResponse.redirect(new URL('/download?status=failed', request.url), 303);
    }

    const redirectUrl = new URL(`/download?payment_id=${encodeURIComponent(paymentId)}`, request.url);
    return NextResponse.redirect(redirectUrl, 303);
  } catch (error) {
    console.error('Payment callback failed:', error);
    return NextResponse.redirect(new URL('/download?status=error', request.url), 303);
  }
}
