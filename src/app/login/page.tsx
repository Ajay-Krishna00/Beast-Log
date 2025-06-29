import AuthForm from "@/components/AuthForm";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Head from "next/head";
import React from "react";

function page() {
  return (
    <>
    <Head>
        <title>Login</title>
        <meta name="description" content="Login page of Beast Log" />
      </Head>
    <div className="flex min-h-screen flex-row items-center justify-center ">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-sl">Login</CardTitle>
        </CardHeader>

        <AuthForm type="login" />
      </Card>
    </div>
    </>
  );
}

export default page;
