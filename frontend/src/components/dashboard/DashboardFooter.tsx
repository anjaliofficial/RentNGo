export default function DashboardFooter() {
  return (
    <footer className="border-t border-neutral-100 bg-white px-6 py-8 text-sm text-neutral-500">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Governance */}
        <div>
          <h4 className="font-semibold text-primary-900 mb-2">Governance</h4>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:text-secondary-600">Security Protocol</a>
            </li>
            <li>
              <a href="#" className="hover:text-secondary-600">Sustainability Report</a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold text-primary-900 mb-2">Legal</h4>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:text-secondary-600">Insurance Policy</a>
            </li>
            <li>
              <a href="#" className="hover:text-secondary-600">Trust & Safety</a>
            </li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4 className="font-semibold text-primary-900 mb-2">Connect</h4>
          <div className="flex gap-3">
            <a href="#" aria-label="Twitter" className="hover:text-secondary-600">🐦</a>
            <a href="#" aria-label="Facebook" className="hover:text-secondary-600">📘</a>
            <a href="#" aria-label="LinkedIn" className="hover:text-secondary-600">💼</a>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} RentNGo. Secure Circular Economy.
      </p>
    </footer>
  );
}
