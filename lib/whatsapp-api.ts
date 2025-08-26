export interface WhatsAppInstance {
  id: string
  token: string
  status: 'disconnected' | 'connecting' | 'connected'
  paircode?: string
  qrcode?: string
  name: string
  profileName?: string
  profilePicUrl?: string
  isBusiness?: boolean
  plataform?: string
  systemName: string
  owner?: string
  lastDisconnect?: string
  lastDisconnectReason?: string
  adminField01?: string
  openai_apikey?: string
  chatbot_enabled?: boolean
  chatbot_ignoreGroups?: boolean
  chatbot_stopConversation?: string
  chatbot_stopMinutes?: number
  created: string
  updated: string
  delayMin?: number
  delayMax?: number
}

export interface CreateInstanceRequest {
  name: string
  systemName: string
  adminField01?: string
  adminField02?: string
}

export interface ConnectInstanceRequest {
  phone?: string
}

export interface WhatsAppApiResponse {
  connected: boolean
  loggedIn: boolean
  jid: string | null
  instance: WhatsAppInstance
}

export class WhatsAppApiService {
  private baseUrl = '/api/whatsapp'

  async createInstance(data: CreateInstanceRequest): Promise<WhatsAppApiResponse> {
    const response = await fetch(`${this.baseUrl}/instances`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async connectInstance(instanceToken: string, data: ConnectInstanceRequest = {}): Promise<WhatsAppApiResponse> {
    const response = await fetch(`${this.baseUrl}/instances/${instanceToken}/connect`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async getInstanceStatus(instanceToken: string): Promise<WhatsAppApiResponse> {
    const response = await fetch(`${this.baseUrl}/instances/${instanceToken}/status`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async disconnectInstance(instanceToken: string): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseUrl}/instances/${instanceToken}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'disconnect' }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async deleteInstance(instanceToken: string): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseUrl}/instances/${instanceToken}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }
}

// Utility function to create a new service instance
export function createWhatsAppApiService() {
  const adminToken = process.env.WHATSAPP_ADMIN_TOKEN || process.env.NEXT_PUBLIC_WHATSAPP_ADMIN_TOKEN
  
  if (!adminToken) {
    throw new Error('WHATSAPP_ADMIN_TOKEN environment variable is not set')
  }

  return new WhatsAppApiService()
}