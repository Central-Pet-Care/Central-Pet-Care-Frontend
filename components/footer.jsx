import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-violet-100 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Company / Logo + About */}
        <div>
          <img
            src="https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/Logo-new.jpg"
            alt="Central Pet Care Logo"
            className="w-28 h-28 rounded-full object-cover mb-3 shadow-md"
          />
          <p className="text-violet-600 text-sm">
            Central Pet Care is your trusted partner for pet adoption, grooming, vet care, and quality products.
            Compassion, care, and community — all in one place.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-bold text-violet-700 mb-3">Contact Us</h3>
          <p className="text-violet-600 text-sm mb-1 flex items-center">
            <FaPhoneAlt className="text-pink-500 mr-2" /> <span>+1 (234) 567-890</span>
          </p>
          <p className="text-violet-600 text-sm mb-1 flex items-center">
            <FaEnvelope className="text-pink-500 mr-2" /> <a href="mailto:info@centralpetcare.com" className="hover:text-pink-500">info@centralpetcare.com</a>
          </p>
          <p className="text-violet-600 text-sm mb-1 flex items-center">
            <FaMapMarkerAlt className="text-pink-500 mr-2" />
            <a href="https://goo.gl/maps/abc123" target="_blank" rel="noreferrer" className="hover:text-pink-500">
              123 Pet St, Petville
            </a>
          </p>
          <p className="text-violet-600 text-sm flex items-center">
            <FaClock className="text-pink-500 mr-2" /> Mon - Sat: 9am - 7pm
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold text-violet-700 mb-3">Quick Links</h3>
          <ul className="space-y-1 text-violet-600 text-sm">
            <li><a href="#" className="hover:text-pink-500">Adopt</a></li>
            <li><a href="#" className="hover:text-pink-500">Services</a></li>
            <li><a href="#" className="hover:text-pink-500">Shop</a></li>
            <li><a href="#" className="hover:text-pink-500">FAQs</a></li>
            <li><a href="#" className="hover:text-pink-500">Terms &amp; Conditions</a></li>
            <li><a href="#" className="hover:text-pink-500">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Social + Newsletter */}
        <div>
          <h3 className="text-lg font-bold text-violet-700 mb-3">Stay Connected</h3>

          <div className="flex space-x-3 mb-4">
            <a href="#" className="text-pink-500 text-2xl hover:text-pink-600"><FaFacebookF /></a>
            <a href="#" className="text-pink-500 text-2xl hover:text-pink-600"><FaInstagram /></a>
            <a href="#" className="text-pink-500 text-2xl hover:text-pink-600"><FaTwitter /></a>
            <a href="#" className="text-pink-500 text-2xl hover:text-pink-600"><FaYoutube /></a>
          </div>

          <form className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="w-full rounded-l-full border border-violet-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-r-full px-4"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 text-center text-violet-500 text-xs">
        © 2025 Central Pet Care. All rights reserved.
      </div>
    </footer>
  );
}
