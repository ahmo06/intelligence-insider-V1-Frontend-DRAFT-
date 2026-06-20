export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#0a0a0a] text-[#e4e4e4]">
      <div className="w-full max-w-sm rounded-xl border border-[#2a2a2a] bg-[#111] p-8">
        <h1 className="mb-2 text-xl font-semibold">Sign in</h1>
        <p className="mb-6 text-sm text-[#888]">
          Login is handled via cursor.com. Use live capture to record the auth
          flow and wire hooks here.
        </p>
        <a
          href="https://cursor.com/agents"
          className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-white text-sm font-medium text-black"
        >
          Open cursor.com
        </a>
      </div>
    </div>
  );
}
