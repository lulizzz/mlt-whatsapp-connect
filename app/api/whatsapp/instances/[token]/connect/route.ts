import { NextRequest, NextResponse } from 'next/server'
import https from 'https'

const BASE_URL = 'https://mltcorp.uazapi.com'

// Create agent to ignore SSL certificate issues in development
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const body = await request.json()

    const response = await fetch(`${BASE_URL}/instance/connect`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'token': token,
      },
      body: JSON.stringify(body),
      // @ts-ignore
      agent: httpsAgent,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Connect API Error:', response.status, errorText)
      return NextResponse.json(
        { error: `Connect API Error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Connect error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}