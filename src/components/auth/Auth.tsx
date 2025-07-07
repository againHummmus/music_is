'use client'

import HumbleiconsEye from "~icons/humbleicons/eye?width=24px&height=24px";
import HumbleiconsEyeClose from "~icons/humbleicons/eye-close?width=24px&height=24px";
import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RoundButton } from "@/components/shared/buttons/RoundButton";
import { useStore } from "@/app/store";

interface PasswordInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = "Enter password",
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full relative">
      <input
        type={showPassword ? "text" : "password"}
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

export default function AuthScreen({ initialMode }: { initialMode?: "signIn" | "signUp" }) {
  const router = useRouter();
  const [mode, setMode] = useState<"signIn" | "signUp">(initialMode || "signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const signInAction = useStore((state) => state.signIn);
  const signUpAction = useStore((state) => state.signUp);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    if (mode === "signUp" && !agreeToTerms) {
      setError("You must agree to the processing of personal data.");
      return;
    }
    setLoading(true);
    setError("");

    const res = await signInAction(email, password);
    if (res.data?.error) {
      console.error(res.data.error.message);
      setError(res.data.error.message);
    } else {
      router.push("/home");
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      setError("All fields are required");
      return;
    }
    if (!agreeToTerms) { // Check if terms are agreed
      setError("You must agree to the processing of personal data.");
      return;
    }
    setLoading(true);
    setError("");

    const res = await signUpAction(email, password, username);
    if (res.data?.error) {
      console.error(res.data.error.message);
      setError('Something went wrong:(');
    } else {
      router.push("/activate");
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center font-inter"> {/* Added font-inter for consistency */}
      <div className="w-full flex flex-col justify-center items-center gap-3">
        {mode === "signIn" ? (
          <>
            <h3 className="text-5xl font-bold text-gray-800">Sign in</h3>
            <p className="text-sm text-gray-600">
              or{" "}
              <button
                onClick={() => {
                  setError("");
                  setEmail("");
                  setPassword("");
                  setAgreeToTerms(false); // Reset checkbox on mode change
                  setMode("signUp");
                }}
                className="inline-block underline text-mainOrange hover:text-orange-700 transition-colors duration-200"
              >
                sign up
              </button>{" "}
              if you're new
            </p>
            <div className="flex flex-col items-center rounded-[7px] bg-mainOrange w-full max-w-[400px] mx-3 p-[30px] gap-6 shadow-lg"> {/* Adjusted gap and added shadow */}
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
              />
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
              />
              <RoundButton
                title={"OK"}
                loading={loading}
                onClick={handleSignIn}
              />
            </div>
            {error && (
              <div className="rounded-sm border border-badRed flex items-center justify-center py-1 px-3 mt-4">
                <p className="text-badRed font-medium">{error}</p>
              </div>
            )}
          </>
        ) : (
          <>
            <h3 className="text-5xl font-bold text-gray-800">Sign up</h3>
            <p className="text-sm text-gray-600">
              or{" "}
              <button
                onClick={() => {
                  setError("");
                  setEmail("");
                  setPassword("");
                  setUsername("");
                  setAgreeToTerms(false); // Reset checkbox on mode change
                  setMode("signIn");
                }}
                className="inline-block underline text-mainOrange hover:text-orange-700 transition-colors duration-200"
              >
                sign in
              </button>{" "}
              to pick up where you left off
            </p>
            <div className="flex flex-col items-center bg-mainOrange rounded-[7px] w-full max-w-[400px] mx-3 p-[30px] gap-6 shadow-lg"> {/* Adjusted gap and added shadow */}
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
              />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
              />
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
              />
              {/* Privacy Consent Checkbox for Sign Up */}
              <div className="w-full flex items-center mt-2">
                <input
                  type="checkbox"
                  id="agreeSignUp"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500 cursor-pointer"
                />
                <label htmlFor="agreeSignIn" className="ml-2 text-sm text-gray-700 select-none">
                  I agree to the{" "}
                  <Link href="/privacy" className="underline text-orange-800 hover:text-orange-900 transition-colors duration-200">
                    processing of my personal data
                  </Link>
                </label>
              </div>
              <RoundButton
                title={"OK"}
                loading={loading}
                onClick={handleSignUp}
                disabled={loading || !agreeToTerms}
              />
            </div>
            {error && (
              <div className="rounded-sm border border-badRed flex items-center justify-center py-1 px-3 mt-4">
                <p className="text-badRed font-medium">{error}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}