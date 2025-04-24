import React from 'react'
import AuthForm from '@/components/AuthForm'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

function signup() {
  return (
    <div className="flex min-h-screen flex-row items-center justify-center ">
      <Card className='w-full max-w-md'>
        <CardHeader >
          <CardTitle className='text-3xl text-center font-sl'>Sign Up</CardTitle>
        </CardHeader>
        
        <AuthForm type='signup'/>
      </Card>
    </div>
  )
}

export default signup 