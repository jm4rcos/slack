import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { useAuthActions } from '@convex-dev/auth/react'

import { SignInFlow } from '../types'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { TriangleAlertIcon } from 'lucide-react'

interface SignInCardProps {
  setState: (state: SignInFlow) => void
}

export const SignInCard = ({
  setState
}: SignInCardProps) => {
  const { signIn } = useAuthActions()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const onPasswordSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)
    signIn("password", { email, password, flow: "signIn" })
      .catch(() => {
        setError("Invalid email or password")
      })
      .finally(() => setPending(false))
  }

  const handleProviderSignIn = (value: "google" | "github") => {
    setPending(true)
    signIn(value)
      .finally(() => setPending(false))
  }

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {error && <div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6'>
        <TriangleAlertIcon className='size-4' />
        <p>{error}</p>
      </div>}
      <CardContent className="px-0 pb-0 space-y-5">
        <form onSubmit={onPasswordSignIn} className="space-y-2.5">
          <Input
            disabled={pending}
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={pending}
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Button variant="default" type="submit" className="w-full" size="lg" disabled={pending}>
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            onClick={() => handleProviderSignIn("google")}
            className="w-full relative"
            variant="outline"
            size="lg"
            disabled={pending}
          >
            <FcGoogle className='size-5 absolute top-3 left-2.5' />
            Continue with Google
          </Button>
          <Button
            onClick={() => handleProviderSignIn("github")}
            className="w-full relative"
            variant="outline"
            size="lg"
            disabled={pending}
          >
            <FaGithub className='size-5 absolute top-3 left-2.5' />
            Continue with Github
          </Button>
        </div>
        <p className='text-xs text-muted-foreground'>
          Don&apos;t have an account? <span onClick={() => setState("signUp")} className="text-sky-700 hover:underline cursor-pointer">Sign up</span>
        </p>
      </CardContent>
    </Card>
  )
}