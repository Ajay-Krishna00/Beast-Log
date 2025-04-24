"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function Welcome() {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/login");
  };
  const handleSignUp = () => {
    router.push("/signup");
  };
  return (
    <div className="flex h-full w-full flex-row items-center justify-center ">
      <Card className="w-full max-w-lg " >
          <CardHeader className='text-4xl text-center font-sl mt-4'>
            Welcome Player
          </CardHeader>
          <CardContent className="flex flex-col gap-4 mt-4 mb-4">
            <Button className="font-sl text-2xl" onClick={handleLogin}>Login</Button>
            <Button className="font-sl text-2xl" onClick={handleSignUp}>Sign Up</Button>
          </CardContent>
    </Card>
    </div>
  )
}

export default Welcome