import RegisterForm from "@/components/auth/RegisterForm";
import Navbar from "@/components/layout/Navbar";

export default function RegisterPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <RegisterForm />
      </main>
    </>
  );
}