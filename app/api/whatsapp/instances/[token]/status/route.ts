import { NextRequest, NextResponse } from 'next/server'
import https from 'https'

const BASE_URL = 'https://mltcorp.uazapi.com'

// Create agent to ignore SSL certificate issues in development
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    const response = await fetch(`${BASE_URL}/instance/status`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'token': token,
      },
      // @ts-ignore
      agent: httpsAgent,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Status API Error:', response.status, errorText)
      return NextResponse.json(
        { error: `Status API Error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}