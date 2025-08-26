'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { QrCode, Smartphone, Wifi, RefreshCw, CheckCircle } from 'lucide-react'
import { WhatsAppApiService, WhatsAppInstance } from '@/lib/whatsapp-api'
import Image from 'next/image'

interface InstanceWithConnection extends WhatsAppInstance {
  connected: boolean
  loggedIn: boolean
  jid: string | null
}

export function ClientWhatsAppConnect() {
  const [instance, setInstance] = useState<InstanceWithConnection | null>(null)
  const [creating, setCreating] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [instanceName, setInstanceName] = useState('')
  const [step, setStep] = useState<'initial' | 'created' | 'qr_generated' | 'connected'>('initial')

  // Initialize API service
  const apiService = new WhatsAppApiService()

  // Create new instance with user-provided name
  const createInstance = async () => {
    if (!instanceName.trim()) {
      alert('Por favor, digite um nome para sua instância.')
      return
    }

    setCreating(true)
    try {
      const response = await apiService.createInstance({
        name: instanceName.trim(),
        systemName: 'mlt-connect',
        adminField01: 'client-connection'
      })

      const newInstance: InstanceWithConnection = {
        ...response.instance,
        connected: response.connected,
        loggedIn: response.loggedIn,
        jid: response.jid
      }

      setInstance(newInstance)
      setStep('created')
    } catch (error) {
      console.error('Error creating instance:', error)
      alert('Erro ao criar instância. Tente novamente.')
    } finally {
      setCreating(false)
    }
  }

  // Generate QR Code
  const generateQRCode = async () => {
    if (!instance) return
    
    setConnecting(true)
    try {
      const response = await apiService.connectInstance(instance.token, {})
      
      setInstance(prev => prev ? {
        ...prev,
        ...response.instance,
        connected: response.connected,
        loggedIn: response.loggedIn,
        jid: response.jid
      } : null)
      
      setStep('qr_generated')
    } catch (error) {
      console.error('Error generating QR code:', error)
      alert('Erro ao gerar QR Code. Tente novamente.')
    } finally {
      setConnecting(false)
    }
  }

  // Check connection status
  const checkStatus = useCallback(async () => {
    if (!instance || step === 'connected') return

    try {
      const response = await apiService.getInstanceStatus(instance.token)
      
      const updatedInstance = {
        ...instance,
        ...response.instance,
        connected: response.connected,
        loggedIn: response.loggedIn,
        jid: response.jid
      }

      setInstance(updatedInstance)

      // Se conectou, mover para o step final
      if (response.connected && response.loggedIn && response.jid) {
        setStep('connected')
      }
    } catch (error) {
      console.error('Error checking status:', error)
    }
  }, [instance, step, apiService])

  // Auto-check status when QR is generated
  useEffect(() => {
    if (step === 'qr_generated' && instance) {
      const interval = setInterval(checkStatus, 3000) // Check every 3 seconds
      return () => clearInterval(interval)
    }
  }, [step, instance, checkStatus])

  // Extract phone number from JID
  const getPhoneNumber = (jid: string | null) => {
    if (!jid) return null
    const match = jid.match(/(\d+)@/)
    return match ? match[1] : null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-500 rounded-full">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">MLT Connect</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Conecte seu WhatsApp aos sistemas da MLT
          </p>
        </div>

        {/* Main Content */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            
            {/* Step 1: Initial - Create Instance */}
            {step === 'initial' && (
              <div className="text-center space-y-6">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Vamos começar!
                  </h2>
                  <p className="text-gray-600">
                    Digite um nome para identificar sua instância e conecte-se aos sistemas da MLT.
                  </p>
                </div>
                
                <div className="max-w-md mx-auto space-y-4">
                  <div className="text-left">
                    <Label htmlFor="instanceName" className="text-sm font-medium text-gray-700 mb-2 block">
                      Nome da Instância
                    </Label>
                    <Input
                      id="instanceName"
                      type="text"
                      placeholder="Ex: Minha Empresa, João Silva, etc."
                      value={instanceName}
                      onChange={(e) => setInstanceName(e.target.value)}
                      className="text-center text-lg py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:ring-green-400"
                      maxLength={50}
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      Este nome será usado para identificar sua conexão
                    </p>
                  </div>
                  
                  <Button
                    onClick={createInstance}
                    disabled={creating || !instanceName.trim()}
                    size="lg"
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-12 py-4 text-lg rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
                  >
                    {creating ? (
                      <>
                        <RefreshCw className="w-6 h-6 mr-3 animate-spin" />
                        Criando instância...
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-6 h-6 mr-3" />
                        Criar Instância MLT
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Instance Created - Generate QR */}
            {step === 'created' && instance && (
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-lg font-medium text-green-600">Instância criada com sucesso!</span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nome da Instância:</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {instance.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">ID da Instância:</p>
                    <p className="font-mono text-sm bg-white px-3 py-2 rounded border">
                      {instance.id}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Gerar QR Code
                  </h3>
                  <p className="text-gray-600">
                    Agora vamos gerar o QR Code para conectar seu WhatsApp.
                  </p>
                </div>

                <Button
                  onClick={generateQRCode}
                  disabled={connecting}
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 text-lg rounded-xl shadow-lg"
                >
                  {connecting ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Gerando QR Code...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-5 h-5 mr-2" />
                      Gerar QR Code
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Step 3: QR Code Generated */}
            {step === 'qr_generated' && instance && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="relative">
                      <Wifi className="w-6 h-6 text-blue-500" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                      Conectando...
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Escaneie o QR Code
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Abra o WhatsApp no seu celular, vá em <strong>Configurações {'>'} Dispositivos conectados {'>'} Conectar dispositivo</strong> e escaneie o código abaixo.
                  </p>
                </div>

                {/* QR Code Display */}
                {instance.qrcode && (
                  <div className="flex justify-center">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100">
                      <Image
                        src={instance.qrcode}
                        alt="WhatsApp QR Code"
                        width={280}
                        height={280}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-800 font-medium">
                    ⏱️ Aguardando conexão...
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    O QR Code será atualizado automaticamente quando você se conectar
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Connected */}
            {step === 'connected' && instance && (
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-green-600">
                        Conectado com sucesso!
                      </h3>
                      <Badge className="bg-green-100 text-green-800 border-green-200 mt-2">
                        <Wifi className="w-4 h-4 mr-1" />
                        Online
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Connection Details */}
                <div className="bg-green-50 rounded-xl p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Número conectado:</p>
                      <p className="font-mono text-lg font-semibold text-green-600">
                        +{getPhoneNumber(instance.jid)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Status:</p>
                      <p className="text-lg font-semibold text-green-600">
                        Conectado aos sistemas MLT
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Nome da Instância:</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {instance.name}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">ID da Instância:</p>
                      <p className="font-mono text-sm text-gray-800">
                        {instance.id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-medium">
                    🎉 Perfeito! Seu WhatsApp está conectado aos sistemas da MLT.
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Você pode fechar esta página agora.
                  </p>
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Powered by <strong>MLT Corp</strong> • WhatsApp Connect
          </p>
        </div>
      </div>
    </div>
  )
}