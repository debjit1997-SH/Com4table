import LoginForm from "@/components/login-form"
import Debug from "@/components/debug"
import DbInitializer from "@/components/db-initializer"
import AdminLogin from "@/components/admin-login"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
          <LoginForm />
          <AdminLogin />
          <DbInitializer />
          <Debug />
        </div>
      </div>
    </div>
  )
}
