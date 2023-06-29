'use client';
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Input from '@/app/components/inputs/Input';
import Button from '@/app/components/Button';
import AuthSocialButton from './AuthSocialButton';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { toast } from 'react-hot-toast';

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
    const session = useSession();
    const router = useRouter();

    const [variant, setVariant] = useState<Variant>('LOGIN');

    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if(session?.status === 'authenticated'){
            router.push('/users');
        }
    }, [session?.status, router]);
    const toggleVariant = useCallback(() => {
        if(variant === 'LOGIN'){
            setVariant('REGISTER');
        }
        else{
            setVariant('LOGIN');
        }
    }, [variant]);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setLoading(true);
        
        if(variant === 'REGISTER'){
            // here data is name, email and password. Also it is mapped to api/register. This function will send the details on Submit, as name, email and password input fields to the backend (by register/route.ts file)
            axios.post('/api/register', data)
            .then(() => signIn('credentials', data))
            .catch(() => toast.error("Something went wrong!"))
            .finally(() => setLoading(false))
        }
        
        if(variant === 'LOGIN'){
            signIn('credentials', {
                ...data,
                redirect: false
            })
            .then((callback) => {
                if(callback?.error){
                    toast.error("Invalid credentials!");
                }
                
                if(callback?.ok && !callback?.error){
                    toast.success('Logged In!');
                    router.push('/users');
                }
            })
            .finally(() => setLoading(false));
        }
    }

    const socialAction = (action: string) => {
        setLoading(true);

        signIn(action, { redirect: false })
        .then((callback) => {
            if(callback?.error){
                toast.error("Invalid credentials!");
            }
            if(callback?.ok && !callback?.error){
                toast.success('Logged In!!')
            }
        })
        
        .finally(() => setLoading(false));
    }
    return (
        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
            <div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
                <form className='space-y-6' 
                onSubmit={handleSubmit(onSubmit)}>
                    {variant === 'REGISTER' && (
                        <Input id="name" disabled={isLoading} 
                         label="Name" 
                         register={register} errors={errors} 
                         required />
                    )}
                    <Input id="email"
                        disabled={isLoading}
                         label="Email Address"
                         type="email" 
                         register={register} errors={errors} 
                         required />
                    <Input id="password"
                        disabled={isLoading}
                         label="Password" 
                         type="password"
                         register={register} errors={errors} 
                         required />
                    <div>
                        <Button
                        disabled={isLoading}
                        fullWidth
                        type="submit">
                            {variant === 'LOGIN' ? 'Sign in' : 'Register'}
                        </Button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"/>
                        </div>

                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    
                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton icon={BsGithub}
                        onClick={() => socialAction('github')}/>
                        <AuthSocialButton icon={BsGoogle}
                        onClick={() => socialAction('google')}/>
                    </div>
                </div>

                <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                    <div>
                        {variant === 'LOGIN' ? 'New to Chatify?' : 'Already have an account?'}
                    </div>
                    <div className='underline cursor-pointer'
                    onClick={toggleVariant}>
                        {variant === 'LOGIN' ? 'Create an account' : 'Login'}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthForm;