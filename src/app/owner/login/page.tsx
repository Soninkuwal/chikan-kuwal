import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Crown } from 'lucide-react'

export default function OwnerLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm bg-card border-border">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Crown className="h-12 w-12 text-primary"/>
            </div>
          <CardTitle className="text-2xl text-primary">Owner Login</CardTitle>
          <CardDescription>Enter your credentials to access the owner panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="owner@example.com" defaultValue="sonickuwal@gmail.com" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" defaultValue="kuwal@1998" required />
            </div>
            <Link href="/owner/dashboard" className="w-full">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-base font-bold">Login</Button>
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            <Link href="/" className="underline text-muted-foreground hover:text-primary">
              Back to Game
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
