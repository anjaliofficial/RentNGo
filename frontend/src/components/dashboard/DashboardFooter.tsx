export default function DashboardFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="flex flex-col items-center justify-between gap-4 px-8 py-6 text-sm text-slate-500 md:flex-row">

        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-blue-600">
            RentNGo
          </span>
          . All rights reserved.
        </p>

        <div className="flex items-center gap-6">

          <button className="transition hover:text-blue-600">
            Privacy Policy
          </button>

          <button className="transition hover:text-blue-600">
            Terms of Service
          </button>

          <button className="transition hover:text-blue-600">
            Help Center
          </button>

          <button className="transition hover:text-blue-600">
            Contact
          </button>

        </div>

      </div>
    </footer>
  );
}