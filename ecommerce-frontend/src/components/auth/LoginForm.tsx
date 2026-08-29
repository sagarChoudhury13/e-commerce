"use client"

import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from 'react-hook-form';
import { loginSchema } from './schema';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/toast';
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
import { useErrorToast } from '@/hooks/error-toast';
import { useAuthStore } from '@/store/useAuthStore';

export function LoginForm() {

  const router = useRouter();
  const {showErrorToast} = useErrorToast();
  const setUser = useAuthStore((state) => state.setUser);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  })


  async function onSubmit(data: z.infer<typeof loginSchema>) {
    try {
    const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }) 
    })
    if(!loginResponse.ok){
      const errorData = await loginResponse.json()
      throw new Error(JSON.stringify({ 
          code: errorData.errorCode, 
          message: errorData.message 
        }));
    }

    const {token, user, message} = await loginResponse.json();
    localStorage.setItem("token", token)
    setUser(user);
    console.log(message);
    toast.add({
      type: "success",
      title: `Hi ${user.name}!`,
      description: "Redirecting to home page ...."
    })
    router.push("/")
    
  } catch (err:any)
    {
      try {
          const parsedError = JSON.parse(err.message);
          showErrorToast(parsedError.code, parsedError.message);
        } catch {
          showErrorToast(undefined, "Network error. Is the server running?");
        }
    }
  }

  return (
    
    <Card className="w-full sm:max-w-md mx-auto mt-12 shadow-lg text-card-foreground border-border bg-card gap-2">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight">Login to your Account</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Don't have an account? <Link href="/signup" className='text-muted-foreground hover:text-foreground transition-colors'>Sign up</Link>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup className="space-y-4">
            
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-2">
                  <FieldLabel htmlFor={field.name} className="text-sm font-medium leading-none">Email:</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    placeholder='Example: me@gmail.com'
                    className="w-full"
                  />
                  <FieldDescription className="text-[0.8rem] text-muted-foreground">
                    Provide your registered email to log in.
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
                    Enter password to this account
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

export default LoginForm;