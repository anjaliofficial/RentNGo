import Navbar from "@/components/layout/Navbar";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <>
      <Navbar />

      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <LoginForm />
      </main>
    </>
  );
}