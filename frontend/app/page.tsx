import LoginForm from "@/components/login-form"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 animated-bg music-pattern">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 opacity-20 hidden md:block">
        <div className="w-32 h-32 rounded-full bg-purple-500 blur-3xl"></div>
      </div>
      <div className="absolute bottom-10 right-10 opacity-20 hidden md:block">
        <div className="w-40 h-40 rounded-full bg-indigo-500 blur-3xl"></div>
      </div>
    </main>
  )
}

