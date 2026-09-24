'use client';

import HumbleiconsEye from '~icons/humbleicons/eye?width=24px&height=24px';
import HumbleiconsEyeClose from '~icons/humbleicons/eye-close?width=24px&height=24px';
import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RoundButton } from '@/components/shared/buttons/RoundButton';
import { useAuthStore } from '@/stores/authStore';

interface PasswordInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter password',
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pr-10 ${className}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
      >
        {showPassword ? (
          <HumbleiconsEye className="text-gray-500" />
        ) : (
          <HumbleiconsEyeClose className="text-gray-500" />
        )}
      </button>
    </div>
  );
};

export default function AuthScreen({
  initialMode,
}: {
  initialMode?: 'signIn' | 'signUp';
}) {
  const router = useRouter();
  const [mode, setMode] = useState<'signIn' | 'signUp'>(
    initialMode || 'signIn'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const signInAction = useAuthStore((state) => state.signIn);
  const signUpAction = useAuthStore((state) => state.signUp);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('All fields are required');
      return;
    }
    if (mode === 'signUp' && !agreeToTerms) {
      setError('You must agree to the processing of personal data.');
      return;
    }
    setLoading(true);
    setError('');

    const res = await signInAction(email, password);
    if (res.error) {
      console.error(res.error?.message ?? res.error);
      setError(res.error?.message ?? 'Something went wrong');
    } else {
      router.push('/library');
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      setError('All fields are required');
      return;
    }
    if (!agreeToTerms) {
      setError('You must agree to the processing of personal data.');
      return;
    }
    setLoading(true);
    setError('');

    const res = await signUpAction(email, password, username);
    if (res.error) {
      console.error(res.error?.message ?? res.error);
      setError('Something went wrong:(');
    } else {
      router.push('/activate');
    }
    setLoading(false);
  };

  return (
    <div className="font-inter flex h-screen w-full flex-col items-center justify-center">
      {' '}
      {/* Added font-inter for consistency */}
      <div className="flex w-full flex-col items-center justify-center gap-3">
        {mode === 'signIn' ? (
          <>
            <h3 className="text-5xl font-bold text-gray-800">Sign in</h3>
            <p className="text-sm text-gray-600">
              or{' '}
              <button
                onClick={() => {
                  setError('');
                  setEmail('');
                  setPassword('');
                  setAgreeToTerms(false); // Reset checkbox on mode change
                  setMode('signUp');
                }}
                className="inline-block text-mainOrange underline transition-colors duration-200 hover:text-orange-700"
              >
                sign up
              </button>{' '}
              if you&apos;re new
            </p>
            <div className="mx-3 flex w-full max-w-[400px] flex-col items-center gap-6 rounded-[7px] bg-mainOrange p-[30px] shadow-lg">
              {' '}
              {/* Adjusted gap and added shadow */}
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <RoundButton
                title={'OK'}
                loading={loading}
                onClick={handleSignIn}
              />
            </div>
            {error && (
              <div className="mt-4 flex items-center justify-center rounded-sm border border-badRed px-3 py-1">
                <p className="font-medium text-badRed">{error}</p>
              </div>
            )}
          </>
        ) : (
          <>
            <h3 className="text-5xl font-bold text-gray-800">Sign up</h3>
            <p className="text-sm text-gray-600">
              or{' '}
              <button
                onClick={() => {
                  setError('');
                  setEmail('');
                  setPassword('');
                  setUsername('');
                  setAgreeToTerms(false); // Reset checkbox on mode change
                  setMode('signIn');
                }}
                className="inline-block text-mainOrange underline transition-colors duration-200 hover:text-orange-700"
              >
                sign in
              </button>{' '}
              to pick up where you left off
            </p>
            <div className="mx-3 flex w-full max-w-[400px] flex-col items-center gap-6 rounded-[7px] bg-mainOrange p-[30px] shadow-lg">
              {' '}
              {/* Adjusted gap and added shadow */}
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {/* Privacy Consent Checkbox for Sign Up */}
              <div className="mt-2 flex w-full items-center">
                <input
                  type="checkbox"
                  id="agreeSignUp"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="form-checkbox h-4 w-4 cursor-pointer rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label
                  htmlFor="agreeSignIn"
                  className="ml-2 select-none text-sm text-gray-700"
                >
                  I agree to the{' '}
                  <Link
                    href="/privacy"
                    className="text-orange-800 underline transition-colors duration-200 hover:text-orange-900"
                  >
                    processing of my personal data
                  </Link>
                </label>
              </div>
              <RoundButton
                title={'OK'}
                loading={loading}
                onClick={handleSignUp}
                disabled={loading || !agreeToTerms}
              />
            </div>
            {error && (
              <div className="mt-4 flex items-center justify-center rounded-sm border border-badRed px-3 py-1">
                <p className="font-medium text-badRed">{error}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
