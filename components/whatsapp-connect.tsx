'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { QrCode, Smartphone, Wifi, WifiOff, RefreshCw, Plus, Trash2 } from 'lucide-react'
import { WhatsAppApiService, WhatsAppInstance, WhatsAppApiResponse } from '@/lib/whatsapp-api'
import Image from 'next/image'

interface InstanceWithConnection extends WhatsAppInstance {
  connected: boolean
  loggedIn: boolean
}

export function WhatsAppConnect() {
  const [instances, setInstances] = useState<InstanceWithConnection[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newInstanceName, setNewInstanceName] = useState('')
  const [selectedInstancePhone, setSelectedInstancePhone] = useState('')
  const [connectingInstance, setConnectingInstance] = useState<string | null>(null)

  // Initialize API service
  const apiService = new WhatsAppApiService()

  // Create new instance
  const createInstance = async () => {
    if (!newInstanceName) return

    setCreating(true)
    try {
      const response = await apiService.createInstance({
        name: newInstanceName,
        systemName: 'whatsapp-connect',
        adminField01: 'instance-metadata'
      })

      const newInstance: InstanceWithConnection = {
        ...response.instance,
        connected: response.connected,
        loggedIn: response.loggedIn
      }

      setInstances(prev => [...prev, newInstance])
      setNewInstanceName('')
    } catch (error) {
      console.error('Error creating instance:', error)
      alert('Error creating instance. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  // Connect instance to WhatsApp
  const connectInstance = async (instanceToken: string, phone?: string) => {
    setConnectingInstance(instanceToken)
    try {
      const response = await apiService.connectInstance(instanceToken, phone ? { phone } : {})
      
      // Update instance in the list
      setInstances(prev => prev.map(instance => 
        instance.token === instanceToken 
          ? { ...instance, ...response.instance, connected: response.connected, loggedIn: response.loggedIn }
          : instance
      ))

      setSelectedInstancePhone('')
    } catch (error) {
      console.error('Error connecting instance:', error)
      alert('Error connecting instance. Please try again.')
    } finally {
      setConnectingInstance(null)
    }
  }

  // Refresh instance status
  const refreshInstanceStatus = async (instanceToken: string) => {
    try {
      const response = await apiService.getInstanceStatus(instanceToken)
      
      setInstances(prev => prev.map(instance => 
        instance.token === instanceToken 
          ? { ...instance, ...response.instance, connected: response.connected, loggedIn: response.loggedIn }
          : instance
      ))
    } catch (error) {
      console.error('Error refreshing instance status:', error)
    }
  }

  // Delete instance
  const deleteInstance = async (instanceToken: string) => {
    if (!confirm('Are you sure you want to delete this instance?')) return

    try {
      await apiService.deleteInstance(instanceToken)
      setInstances(prev => prev.filter(instance => instance.token !== instanceToken))
    } catch (error) {
      console.error('Error deleting instance:', error)
      alert('Error deleting instance. Please try again.')
    }
  }

  // Auto-refresh instance statuses
  useEffect(() => {
    const interval = setInterval(() => {
      instances.forEach(instance => {
        if (instance.status === 'connecting') {
          refreshInstanceStatus(instance.token)
        }
      })
    }, 5000) // Refresh every 5 seconds for connecting instances

    return () => clearInterval(interval)
  }, [instances])

  const getStatusBadge = (instance: InstanceWithConnection) => {
    if (instance.connected && instance.loggedIn) {
      return <Badge className="bg-green-500 text-white">Connected</Badge>
    } else if (instance.status === 'connecting') {
      return <Badge className="bg-yellow-500 text-white">Connecting</Badge>
    } else {
      return <Badge variant="secondary">Disconnected</Badge>
    }
  }

  const getStatusIcon = (instance: InstanceWithConnection) => {
    if (instance.connected && instance.loggedIn) {
      return <Wifi className="size-4 text-green-500" />
    } else if (instance.status === 'connecting') {
      return <RefreshCw className="size-4 text-yellow-500 animate-spin" />
    } else {
      return <WifiOff className="size-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">WhatsApp Connect</h1>
          <p className="text-gray-600 mt-2">Manage your WhatsApp instances with QR code connection</p>
        </div>

        {/* Create New Instance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="size-5" />
              Create New Instance
            </CardTitle>
            <CardDescription>
              Create a new WhatsApp instance to connect your device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="instanceName">Instance Name</Label>
                <Input
                  id="instanceName"
                  value={newInstanceName}
                  onChange={(e) => setNewInstanceName(e.target.value)}
                  placeholder="Enter instance name"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={createInstance} 
                  disabled={creating || !newInstanceName}
                  className="bg-green-500 hover:bg-green-600"
                >
                  {creating ? (
                    <RefreshCw className="size-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="size-4 mr-2" />
                  )}
                  Create Instance
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instances List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {instances.map((instance) => (
            <Card key={instance.id} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{instance.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteInstance(instance.token)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(instance)}
                  {getStatusBadge(instance)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Instance Info */}
                <div className="text-sm text-gray-600">
                  <p><strong>ID:</strong> {instance.id}</p>
                  <p><strong>System:</strong> {instance.systemName}</p>
                  {instance.profileName && (
                    <p><strong>Profile:</strong> {instance.profileName}</p>
                  )}
                </div>

                {/* QR Code Display */}
                {instance.qrcode && instance.status === 'connecting' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Scan QR Code:</Label>
                    <div className="flex justify-center p-4 bg-white rounded-lg border">
                      <Image
                        src={instance.qrcode}
                        alt="WhatsApp QR Code"
                        width={200}
                        height={200}
                        className="max-w-full h-auto"
                      />
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Scan this QR code with WhatsApp on your phone
                    </p>
                  </div>
                )}

                {/* Pair Code Display */}
                {instance.paircode && instance.status === 'connecting' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Pairing Code:</Label>
                    <div className="p-3 bg-gray-100 rounded-lg text-center">
                      <span className="text-2xl font-mono font-bold">{instance.paircode}</span>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Enter this code in WhatsApp Settings &gt; Linked Devices &gt; Link a Device
                    </p>
                  </div>
                )}

                {/* Connection Actions */}
                {!instance.connected && instance.status !== 'connecting' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor={`phone-${instance.id}`} className="text-sm">
                        Phone Number (optional for pairing code)
                      </Label>
                      <Input
                        id={`phone-${instance.id}`}
                        value={selectedInstancePhone}
                        onChange={(e) => setSelectedInstancePhone(e.target.value)}
                        placeholder="5511999999999"
                        type="tel"
                      />
                    </div>
                    <Button
                      onClick={() => connectInstance(instance.token, selectedInstancePhone)}
                      disabled={connectingInstance === instance.token}
                      className="w-full bg-green-500 hover:bg-green-600"
                    >
                      {connectingInstance === instance.token ? (
                        <RefreshCw className="size-4 animate-spin mr-2" />
                      ) : (
                        <QrCode className="size-4 mr-2" />
                      )}
                      Generate QR Code
                    </Button>
                  </div>
                )}

                {/* Refresh Status */}
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-xs text-gray-500">
                    Updated: {new Date(instance.updated).toLocaleTimeString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => refreshInstanceStatus(instance.token)}
                  >
                    <RefreshCw className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {instances.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Smartphone className="mx-auto size-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No instances yet</h3>
              <p className="text-gray-600 mb-4">Create your first WhatsApp instance to get started</p>
              <Button 
                onClick={() => setNewInstanceName('My First Instance')}
                className="bg-green-500 hover:bg-green-600"
              >
                <Plus className="size-4 mr-2" />
                Create Your First Instance
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}