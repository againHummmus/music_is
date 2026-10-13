export function ActivationScreen() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center px-20">
      <div>
        <h1 className="mb-4 w-full text-center text-2xl font-bold">
          Great! The link was sent to your email.
        </h1>
        <p className="mb-6 w-full text-center leading-relaxed">
          Please, check the spam folder if it doesn&apos;t appear right away
        </p>
      </div>
    </div>
  );
}
