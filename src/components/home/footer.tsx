"use client"

export default function Footer() {
  return (
    <footer className="px-6 md:px-12 lg:px-20 py-16 bg-black border-t border-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-gray-400 text-sm space-y-4 mb-8">
          <p>Questions? Call 1-800-NETFLIX (1-800-638-3549) or email support@netflix.com</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
            <div>
              <h3 className="font-bold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Account</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Account
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Media Center
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Cookie Preferences
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Corporate Info
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Shop
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 py-8 border-t border-gray-900">
          <span className="text-gray-500">© 2025 Netflix, Inc.</span>
        </div>
      </div>
    </footer>
  )
}
