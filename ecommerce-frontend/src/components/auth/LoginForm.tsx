"use client"

import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from 'react-hook-form';
import { loginSchema } from './schema';

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

export function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(data: z.infer<typeof loginSchema>) {
    console.log("Valid data ready for Express:", data)
  }

  return (
    <Card className="w-full p- sm:max-w-md mx-auto mt-12 shadow-lg text-card-foreground border-border bg-card">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight">Login to your Account</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Enter your email address and password
        </CardDescription>
        <CardAction>
          
        </CardAction>
      </CardHeader>
      
      <CardContent>
        {/* space-y-6 creates consistent vertical gaps between form sections */}
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* space-y-4 creates the gap between the Email and Password fields */}
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
                    placeholder="min 6 characters"
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

export default LoginForm;