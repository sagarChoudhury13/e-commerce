"use client"

import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from 'react-hook-form';
import { SignUpSchema } from './schema';
import { useErrorToast } from '@/hooks/error-toast';
import { useRouter } from 'next/navigation';
import {toast} from "@/components/ui/toast"
import { 
  Card, 
  CardAction, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Field, 
  FieldDescription, 
  FieldError, 
  FieldGroup, 
  FieldLabel 
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function SignUpForm() {
  const router = useRouter();
  const {showErrorToast} = useErrorToast()
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    mode: "onChange",
    defaultValues: {
      name:"",
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof SignUpSchema>) {
  try {
    const signUpRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      
      body: JSON.stringify({
        name: data.name, 
        email: data.email,
        password: data.password,
      }) 
    });

    if (!signUpRes.ok) {
      const errorResponse = await signUpRes.json();
      throw new Error(JSON.stringify({ 
          code: errorResponse.errorCode, 
          message: errorResponse.message 
        }));
    }
    const {message, token , user} = await signUpRes.json();

    localStorage.setItem("token" , token);

    toast.add({
      title: "Welcome to SHOP XYZ!",
      description: `Account created for ${user.email}. Redirecting...`,
    });

    router.push("/")
    

  } catch (err: any) {
    try {
          const parsedError = JSON.parse(err.message);
          showErrorToast(parsedError.code, parsedError.message);
        } catch {
          showErrorToast(undefined, "Network error. Is the server running?");
        }
  }
}

  return (
    <Card className="w-full p- sm:max-w-md mx-auto mt-12 shadow-lg text-card-foreground border-border bg-card gap-2">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Already have an account? <Link href="/login" className='text-muted-foreground hover:text-foreground transition-colors'>Log in</Link>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* space-y-6 creates consistent vertical gaps between form sections */}
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* space-y-4 creates the gap between the Email and Password fields */}
          <FieldGroup className="space-y-4">
            
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                
                <Field data-invalid={fieldState.invalid} className="space-y-2">
                  <FieldLabel htmlFor={field.name} className="text-sm font-medium leading-none">Name :</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="text"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    placeholder='Enter your name'
                    className="w-full"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} className="text-[0.8rem] font-medium text-destructive" />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-2">
                  <FieldLabel htmlFor={field.name} className="text-sm font-medium leading-none">Email :</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    placeholder="Example: me@gmail.com"
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  />
                  <FieldDescription className="text-[0.8rem] text-muted-foreground">
                    Enter your email address
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} className="text-[0.8rem] font-medium text-destructive" />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-2">
                  <FieldLabel htmlFor={field.name} className="text-sm font-medium leading-none">Password:</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    placeholder="must contain min 5 characters"
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  />
                  <FieldDescription className="text-[0.8rem] text-muted-foreground">
                    Create a strong password 
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} className="text-[0.8rem] font-medium text-destructive" />
                  )}
                </Field>
              )}
            />

          </FieldGroup>
        </form>
      </CardContent>

      {/* Added a subtle top border to separate the actions, and ensured buttons look good on mobile (w-full sm:w-auto) */}
      <CardFooter className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-6 border-t border-border/50">
        <Button type="button" variant="outline" onClick={() => form.reset()} className="w-full sm:w-auto">
          Reset
        </Button>
        <Button variant="default" size="sm" type="submit" form="form-rhf-demo" className="w-full sm:w-auto bg-primary">
          Submit
        </Button>
      </CardFooter>
    </Card>
  )
}

export default SignUpForm;