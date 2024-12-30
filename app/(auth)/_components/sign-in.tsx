"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { authSchema, TAuthSchema } from "@/schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signIn, signInWithGithub, signInWithGoogle } from "@/actions/actions";
import { toast } from "@/hooks/use-toast";

const SignIn = () => {
  const form = useForm<TAuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: TAuthSchema) => {
    const error = await signIn(data);
    if (error) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onGithubSignIn = async () => {
    const error = await signInWithGithub();
    if (error) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  async function onGoogleSignIn() {
    const error = await signInWithGoogle();
    if (error) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        className={"w-full max-w-96"}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card className={"w-full"}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Sign in to your account</CardTitle>
            <CardDescription>Enter your email below to sign in</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-6">
              <Button
                type={"button"}
                onClick={onGithubSignIn}
                disabled={isLoading}
                variant="outline"
              >
                <Icons.gitHub className="mr-2 h-4 w-4" />
                Github
              </Button>
              <Button
                onClick={onGoogleSignIn}
                type={"button"}
                disabled={isLoading}
                variant="outline"
              >
                <Icons.google className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      type={"email"}
                      placeholder="example@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      type={"password"}
                      placeholder="****************"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className={"flex flex-col"}>
            <Button
              type={"submit"}
              disabled={isLoading}
              className="w-full font-semibold"
            >
              {isLoading ? "Authentication..." : "Sign In"}
            </Button>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="underline">
                Sign Up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default SignIn;
