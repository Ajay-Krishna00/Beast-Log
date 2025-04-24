"use client";
import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { loginAction, signupAction } from "@/action/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  type: "login" | "signup";
};

function AuthForm({ type }: Props) {
  const isLogin = type === "login";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleSubmit = (formdata: FormData) => {
    const email = formdata.get("email") as string;
    const password = formdata.get("password") as string;
    let errMsg;
    let title;
    let description;
    startTransition(async () => {
      if (isLogin) {
        errMsg = (await loginAction(email, password)).errMsg;
        title = "Logged in successfully";
        description = "You have been logged in successfully";
      } else {
        errMsg = (await signupAction(email, password)).errMsg;
        title = "Signed up successfully";
        description = "Check your email for verification link";
      }
      if (!errMsg) {
        toast.success(title, {
          description: description,
        });
        if (isLogin) {
          router.replace("/home");
        } else {
          router.replace("/login");
        }
      } else {
        toast.error("Error Occurred", {
          description: errMsg,
        });
      }
    });
  };
  return (
    <>
      <form
        action={handleSubmit}
        className="flex flex-col gap-4 pt-2 pl-4 pr-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="font-sl text-lg">
            Email
          </Label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter Email"
            className="w-full"
            required
            disabled={isPending}
          />
        </div>
        <div>
          <Label htmlFor="password" className="font-sl text-lg">
            Password
          </Label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter Password"
            className="w-full"
            disabled={isPending}
            required
          />
        </div>
        <Button type="submit" className="w-full mt-2 font-sl text-xl">
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : isLogin ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </Button>
        <div>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <Link
            href={isLogin ? "/signup" : "/login"}
            className={`text-blue-500 hover:text-blue-700 transition-colors duration-200 ${isPending && "pointer-events-none"}`}
          >
            {" "}
            {isLogin ? "Sign Up" : "Login"}
          </Link>
        </div>
      </form>
    </>
  );
}

export default AuthForm;
