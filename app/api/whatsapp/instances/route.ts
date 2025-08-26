import { NextRequest, NextResponse } from 'next/server'
import https from 'https'

const BASE_URL = 'https://mltcorp.uazapi.com'
const ADMIN_TOKEN = process.env.WHATSAPP_ADMIN_TOKEN

// Create agent to ignore SSL certificate issues in development
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
})

export async function POST(request: NextRequest) {
  try {
    if (!ADMIN_TOKEN) {
      return NextResponse.json(
        { error: 'WHATSAPP_ADMIN_TOKEN not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()

    const response = await fetch(`${BASE_URL}/instance/init`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'admintoken': ADMIN_TOKEN,
      },
      body: JSON.stringify(body),
      // @ts-expect-error Node.js https agent not typed in fetch
      agent: httpsAgent,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText)
      return NextResponse.json(
        { error: `API Error: ${response.status}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Instance creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}