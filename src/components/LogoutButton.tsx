"use client"
import React from 'react'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { logoutAction } from '@/action/user'

function LogoutButton() {
  const [loading, setLoading] = React.useState(false)
  const router = useRouter();
  const handleLogout = async () => {
    setLoading(true)
    console.log("Logout")
    const {errMsg} = await logoutAction();
    if (!errMsg) {
      toast.success("Logged out successfully")
      router.push("/")
    }
    else {
      toast.error("Error logging out")
    }
    setLoading(false)
  }
  return (
    <Button variant={'outline'}
      className="font-sl text-lg"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? <Loader2 className='animate-spin' /> : "Log Out"}
    </Button>
  )
}

export default LogoutButton