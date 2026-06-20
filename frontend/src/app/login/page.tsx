export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-theme-bg text-primary">
      <div className="w-full max-w-sm rounded-xl border border-tertiary bg-elevated p-8">
        <h1 className="mb-2 text-xl font-semibold">Sign in</h1>
        <p className="mb-6 text-sm text-secondary">
          Sign in with your Cursor account to access agents.
        </p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="Email address"
            className="h-10 w-full rounded-lg border border-tertiary bg-chrome px-3 text-sm text-primary placeholder:text-tertiary focus:border-accent focus:outline-none"
          />
          <button
            type="button"
            className="h-10 w-full rounded-lg bg-primary text-sm font-medium text-inverted hover:opacity-90"
          >
            Continue with email
          </button>
        </form>
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-tertiary" />
          <span className="text-xs text-tertiary">or</span>
          <div className="h-px flex-1 bg-tertiary" />
        </div>
        <div className="space-y-2">
          {["Google", "GitHub", "Apple"].map((provider) => (
            <button
              key={provider}
              type="button"
              className="h-10 w-full rounded-lg border border-tertiary text-sm text-primary hover:bg-secondary"
            >
              Continue with {provider}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
