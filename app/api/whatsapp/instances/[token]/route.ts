import { NextRequest, NextResponse } from 'next/server'
import https from 'https'

const BASE_URL = 'https://mltcorp.uazapi.com'

// Create agent to ignore SSL certificate issues in development
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
})

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    const response = await fetch(`${BASE_URL}/instance/disconnect`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'token': token,
      },
      // @ts-expect-error Node.js https agent not typed in fetch
      agent: httpsAgent,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Delete API Error:', response.status, errorText)
      return NextResponse.json(
        { error: `Delete API Error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({ success: true, ...data })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const body = await request.json()
    const { action } = body

    if (action === 'disconnect') {
      const response = await fetch(`${BASE_URL}/instance/disconnect`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'token': token,
        },
        // @ts-expect-error Node.js https agent not typed in fetch
        agent: httpsAgent,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Disconnect API Error:', response.status, errorText)
        return NextResponse.json(
          { error: `Disconnect API Error: ${response.status}` },
          { status: response.status }
        )
      }

      const data = await response.json()
      return NextResponse.json(data)
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Instance action error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}