"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { Mail, Lock, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useLoginModal } from '@/hooks/use-login-modal';
import { useToast } from '@/components/ui/use-toast';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export function LoginModal() {
  const [isLoading, setIsLoading] = useState(false);
  const loginModal = useLoginModal();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const handleGoogleLogin = () => {
    signIn('google', { 
      callbackUrl: window.location.href 
    });
  };

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      loginModal.onClose();
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      
      // Check if email exists before trying to register
      const checkEmailRes = await fetch(`/api/auth/check-email?email=${encodeURIComponent(data.email)}`);
      const checkEmailData = await checkEmailRes.json();
      
      if (checkEmailData.exists) {
        registerForm.setError('email', {
          type: 'manual',
          message: 'This email is already registered'
        });
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to register");
      }

      // After successful registration, sign in
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: window.location.href,
      });

      if (result?.error) {
        loginModal.onClose();
        toast({
          title: "Success",
          description: "Registration successful. Please log in.",
        });
        return;
      }

      loginModal.onClose();
      toast({
        title: "Success",
        description: "Registration and login successful",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={loginModal.isOpen} onOpenChange={loginModal.onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background/80 backdrop-blur-xl border border-border/40">
        <DialogHeader className="space-y-3 text-center">
          <DialogTitle className="text-2xl font-bold">Welcome</DialogTitle>
          <DialogDescription className="text-base">
            Sign in to share your experience and review AI tools
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-4">
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Input
                  {...loginForm.register('email')}
                  type="email"
                  placeholder="Email"
                  icon={<Mail className="w-4 h-4" />}
                  error={loginForm.formState.errors.email?.message}
                />
                <Input
                  {...loginForm.register('password')}
                  type="password"
                  placeholder="Password"
                  icon={<Lock className="w-4 h-4" />}
                  error={loginForm.formState.errors.password?.message}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                Login
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 mt-4">
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
              <div className="space-y-2">
                <div className="space-y-1">
                  <Input
                    {...registerForm.register('name')}
                    placeholder="Name"
                    icon={<User className="w-4 h-4" />}
                    error={registerForm.formState.errors.name?.message}
                    disabled={isLoading}
                  />
                  {registerForm.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {registerForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Input
                    {...registerForm.register('email')}
                    type="email"
                    placeholder="Email"
                    icon={<Mail className="w-4 h-4" />}
                    error={registerForm.formState.errors.email?.message}
                    disabled={isLoading}
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Input
                    {...registerForm.register('password')}
                    type="password"
                    placeholder="Password"
                    icon={<Lock className="w-4 h-4" />}
                    error={registerForm.formState.errors.password?.message}
                    disabled={isLoading}
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Input
                    {...registerForm.register('confirmPassword')}
                    type="password"
                    placeholder="Confirm Password"
                    icon={<Lock className="w-4 h-4" />}
                    error={registerForm.formState.errors.confirmPassword?.message}
                    disabled={isLoading}
                  />
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !registerForm.formState.isValid}
              >
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="lg"
          className="w-full relative flex items-center justify-center bg-background hover:bg-secondary/80 border-border/50"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <FcGoogle className="w-5 h-5 absolute left-4" />
          <span>Google</span>
        </Button>

        <p className="text-xs text-center text-muted-foreground px-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </DialogContent>
    </Dialog>
  );
}