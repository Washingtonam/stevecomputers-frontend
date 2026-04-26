import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-3">About Us</h1>
        <p className="text-gray-200">
          Trusted Tech • Real Business • Proven Results
        </p>
      </div>

      <div className="max-w-5xl mx-auto p-6">

        {/* STORY */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-3">Who We Are</h2>

          <p className="text-gray-600 mb-3">
            Steve Computer Warehouse is a trusted technology hub based in Benin City,
            Edo State. For years, we have been providing reliable gadgets, professional
            installations, and expert repair services to individuals and businesses.
          </p>

          <p className="text-gray-600">
            With multiple branches across Mission Road, we are known for our
            consistency, quality service, and customer-first approach.
          </p>
        </div>

        {/* WHAT WE DO */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-3">What We Do</h2>

          <ul className="space-y-2 text-gray-600">
            <li>✔ Sale of quality gadgets and accessories</li>
            <li>✔ POS installation for businesses</li>
            <li>✔ CCTV and security system setup</li>
            <li>✔ Device repairs (laptops, printers, etc.)</li>
            <li>✔ Training programs for aspiring technicians</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link to="/products">
            <button className="bg-blue-600 text-white px-6 py-2 rounded">
              Start Shopping
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default About;