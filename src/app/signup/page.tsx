import React from "react";
import AuthForm from "@/components/AuthForm";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Head from "next/head";

function signup() {
  return (
    <>
    <Head>
        <title>Sign Up</title>
        <meta name="description" content="Sign Up page of Beast Log" />
      </Head>
    <div className="flex min-h-screen flex-row items-center justify-center ">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-sl">
            Sign Up
          </CardTitle>
        </CardHeader>

        <AuthForm type="signup" />
      </Card>
    </div>
    </>
  );
}

export default signup;
