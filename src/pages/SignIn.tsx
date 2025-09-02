import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const schema = z.object({
  fullName: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
});

export type SignInValues = z.infer<typeof schema>;

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const form = useForm<SignInValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", email: "" },
    mode: "onSubmit",
  });

  const onSubmit = (values: SignInValues) => {
    try {
      localStorage.setItem(
        "yg_profile",
        JSON.stringify({ fullName: values.fullName, email: values.email })
      );
    } catch {}
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-10">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit">Sign In</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default SignIn;
