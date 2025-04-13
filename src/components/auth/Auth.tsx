"use client";
import HumbleiconsEye from "~icons/humbleicons/eye?width=24px&height=24px";
import HumbleiconsEyeClose from "~icons/humbleicons/eye-close?width=24px&height=24px";
import { useState, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
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

export default function AuthScreen() {
  const router = useRouter();

  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signInAction = useStore((state) => state.signIn);
  const signUpAction = useStore((state) => state.signUp);

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleFileChange = (event: any) => {
    const fileUploaded = event.target.files[0];
    setAvatar(fileUploaded);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await signInAction(email, password);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
      router.push("/");
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !username || !avatar) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await signUpAction(email, password, username, avatar);
    } catch (err: any) {
      console.error("error", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
      router.push("activate");
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full flex flex-col justify-center items-center gap-3">
        {mode === "signIn" ? (
          <>
            <h3 className="text-5xl">Sign in</h3>
            <p className="text-sm">
              or{" "}
              <button
                onClick={() => {
                  setError("");
                  setEmail("");
                  setPassword("");
                  setMode("signUp");
                }}
                className="inline-block underline"
              >
                sign up
              </button>{" "}
              if you're new
            </p>
            <div className="flex flex-col items-center rounded-[7px] bg-mainOrange w-full max-w-[400px] mx-3 p-[30px] gap-10">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full pr-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mainOrange"
              />
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mainOrange"
              />
              {error && <p className="text-red-500">{error}</p>}
              <RoundButton title={loading ? "..." : "OK"} onClick={handleSignIn} disabled={loading} />
            </div>
          </>
        ) : (
          <>
            <h3 className="text-5xl">Sign up</h3>
            <p className="text-sm">
              or{" "}
              <button
                onClick={() => {
                  setError("");
                  setEmail("");
                  setPassword("");
                  setUsername("");
                  setAvatar(null);
                  setMode("signIn");
                }}
                className="inline-block underline"
              >
                sign in
              </button>{" "}
              to pick up where you left off
            </p>
            <div className="flex flex-col items-center bg-mainOrange rounded-[7px] w-full max-w-[400px] mx-3 p-[30px] gap-10">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full pr-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mainOrange"
              />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pr-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mainOrange"
              />
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mainOrange"
              />
              <button
                onClick={handleFileClick}
                className="bg-white text-mainOrange hover:text-mainBlack transition-all flex items-center justify-center p-10 rounded-[7px]"
              >
                {avatar ? "File uploaded!" : "Upload a file"}
              </button>
              <input type="file" onChange={handleFileChange} ref={hiddenFileInput} className="hidden" />
              {error && <p className="text-red-500">{error}</p>}
              <RoundButton title={loading ? "..." : "OK"} onClick={handleSignUp} disabled={loading} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
