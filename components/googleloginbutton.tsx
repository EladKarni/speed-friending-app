"use client"

import { createClient } from '@/utils/supabase/client';
import { Button } from 'flowbite-react'
import { redirect } from 'next/navigation';
import React from 'react'

const GoogleLoginButton = () => {

    const GoogleSignInAction = async () => {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: 'http://localhost:3000/auth/callback'
            },
        })

        if (data.url) {
            redirect(data.url) // use the redirect API for your server framework
        }
    }

    return (
        <Button onClick={GoogleSignInAction}>
            Signin with Google
        </Button>
    )
}

export default GoogleLoginButton