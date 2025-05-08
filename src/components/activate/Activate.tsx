"use client";
import AuthApi from "@/actions/authApi";
import { useStore } from "@/app/store";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ActivationScreen() {
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false)
  const router = useRouter();
  const store = useStore((state) => state);

  useEffect(() => {
    store.setIsLoading(true)
    if (!store.user) {
      router.push("/sign-up");
      return;
    }
    if (store.user.is_activated === true && window.location.pathname === '/activate') {
      router.push("/");
      return;
    }
    store.setIsLoading(false)
  }, [store.user, router]);


  const handleSendEmail = async () => {
    setLoading(true);
    try {
      await AuthApi.sendActivationEmail(store.user?.email)
    } catch (err: any) {
      console.error("error", err.message);
    } finally {
      setLoading(false);
      setLinkSent(true)
    }
  };

  return (
    <div className="relative flex w-full h-full flex-col items-center justify-center">
      {linkSent 

      ? <div>
        <h1 className="mb-4 text-2xl font-bold text-center w-full">Great! The link was sent to your email.</h1>
        <p className="mb-6 leading-relaxed text-center w-full">
          Please, check the spam folder if it doesn't appear right away! Now, you can close this window.
        </p>
      </div> 
      
      : <div className="max-w-[500px] text-center">
        <h1 className="mb-4 text-2xl font-bold text-center w-full">Please, activate your account</h1>
        <p className="mb-6 leading-relaxed text-center w-full">
          To get started, click the button below and we'll send an activation link to your email.
        </p>

        <button
          onClick={handleSendEmail}
          className="mb-4 h-12 max-w-[200px] w-full rounded bg-mainOrange font-semibold text-white transition-colors hover:bg-mainOrange"
        >
          {loading ? '...' : 'Send email'}
        </button>
      </div>}
    </div>
  );
}