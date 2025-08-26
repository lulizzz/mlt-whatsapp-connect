import { Card, CardContent } from '@/components/ui/card'
import { Shield, Users, QrCode, Zap } from 'lucide-react'

export function Features() {
    return (
        <section className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
            <div className="mx-auto max-w-3xl lg:max-w-5xl px-6">
                <div className="relative">
                    <div className="relative z-10 grid grid-cols-6 gap-3">
                        <Card className="relative col-span-full flex overflow-hidden lg:col-span-2">
                            <CardContent className="relative m-auto size-fit pt-6">
                                <div className="relative flex h-24 w-56 items-center">
                                    <QrCode className="absolute inset-0 size-full text-muted p-8" strokeWidth={0.5} />
                                    <span className="mx-auto block w-fit text-5xl font-semibold">QR</span>
                                </div>
                                <h2 className="mt-6 text-center text-3xl font-semibold">Scan to Connect</h2>
                            </CardContent>
                        </Card>
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
                            <CardContent className="pt-6">
                                <div className="relative mx-auto flex aspect-square size-32 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                    <Shield className="m-auto size-16" strokeWidth={1} />
                                </div>
                                <div className="relative z-10 mt-6 space-y-2 text-center">
                                    <h2 className="group-hover:text-secondary-950 text-lg font-medium transition dark:text-white">Secure by default</h2>
                                    <p className="text-foreground">End-to-end encrypted connections with enterprise-grade security protocols.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
                            <CardContent className="pt-6">
                                <div className="pt-6 lg:px-6">
                                    <div className="w-full h-24 flex items-center justify-center bg-gradient-to-r from-green-400 to-green-600 rounded-lg">
                                        <div className="text-white text-center">
                                            <div className="text-2xl font-bold">WhatsApp</div>
                                            <div className="text-sm opacity-80">Connected</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative z-10 mt-14 space-y-2 text-center">
                                    <h2 className="text-lg font-medium transition">Instant Connection</h2>
                                    <p className="text-foreground">Connect your WhatsApp instances in seconds with our streamlined setup.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="relative col-span-full overflow-hidden lg:col-span-3">
                            <CardContent className="grid pt-6 sm:grid-cols-2">
                                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                                    <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                        <Zap className="m-auto size-5" strokeWidth={1} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="group-hover:text-secondary-950 text-lg font-medium text-zinc-800 transition dark:text-white">Lightning Fast</h2>
                                        <p className="text-foreground">Real-time synchronization across all your connected devices and instances.</p>
                                    </div>
                                </div>
                                <div className="rounded-tl-(--radius) relative -mb-6 -mr-6 mt-6 h-fit border-l border-t p-6 py-6 sm:ml-6">
                                    <div className="absolute left-3 top-2 flex gap-1">
                                        <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                                        <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                                        <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                                    </div>
                                    <div className="w-full h-32 flex items-center justify-center">
                                        <div className="space-y-2 w-full">
                                            <div className="h-2 bg-green-200 rounded animate-pulse"></div>
                                            <div className="h-2 bg-green-300 rounded animate-pulse delay-75"></div>
                                            <div className="h-2 bg-green-400 rounded animate-pulse delay-150"></div>
                                            <div className="h-2 bg-green-500 rounded animate-pulse delay-225"></div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="relative col-span-full overflow-hidden lg:col-span-3">
                            <CardContent className="grid h-full pt-6 sm:grid-cols-2">
                                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                                    <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                        <Users className="m-auto size-6" strokeWidth={1} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-lg font-medium transition">Multi-Instance Management</h2>
                                        <p className="text-foreground">Manage multiple WhatsApp instances from a single, intuitive dashboard.</p>
                                    </div>
                                </div>
                                <div className="before:bg-(--color-border) relative mt-6 before:absolute before:inset-0 before:mx-auto before:w-px sm:-my-6 sm:-mr-6">
                                    <div className="relative flex h-full flex-col justify-center space-y-6 py-6">
                                        <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                                            <span className="block h-fit rounded border px-2 py-1 text-xs shadow-sm bg-green-100 text-green-800">Instance 1</span>
                                            <div className="ring-background size-7 ring-4">
                                                <div className="size-full rounded-full bg-green-500 flex items-center justify-center">
                                                    <div className="size-2 bg-white rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative ml-[calc(50%-1rem)] flex items-center gap-2">
                                            <div className="ring-background size-8 ring-4">
                                                <div className="size-full rounded-full bg-blue-500 flex items-center justify-center">
                                                    <div className="size-2 bg-white rounded-full"></div>
                                                </div>
                                            </div>
                                            <span className="block h-fit rounded border px-2 py-1 text-xs shadow-sm bg-blue-100 text-blue-800">Instance 2</span>
                                        </div>
                                        <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                                            <span className="block h-fit rounded border px-2 py-1 text-xs shadow-sm bg-purple-100 text-purple-800">Instance 3</span>
                                            <div className="ring-background size-7 ring-4">
                                                <div className="size-full rounded-full bg-purple-500 flex items-center justify-center">
                                                    <div className="size-2 bg-white rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}