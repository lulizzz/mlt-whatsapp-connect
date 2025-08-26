import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const adminToken = process.env.WHATSAPP_ADMIN_TOKEN
    
    return NextResponse.json({
      success: true,
      hasToken: !!adminToken,
      tokenLength: adminToken?.length || 0,
      message: 'API is working!'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Test failed', details: error },
      { status: 500 }
    )
  }
}