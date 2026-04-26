const PosInstallation = () => {
  const phone = "2348129097599";

  const message = encodeURIComponent(
    "Hello, I want to set up a Business Management System for my business."
  );

  const whatsappLink = `https://wa.me/${phone}?text=${message}`;

  return (
    <div className="bg-gray-50">

      {/* ================= HERO ================= */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
          Stop Guessing Your Business Profit
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Get a complete system that tracks your sales, stock, and performance in real-time — no more losses, no more confusion.
        </p>

        <div className="flex flex-col md:flex-row gap-3 justify-center">
          <a
            href={whatsappLink}
            target="_blank"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            💬 Setup My Business Now
          </a>

          <span className="text-sm text-gray-500">
            ⚡ Installation within 24–48 hours
          </span>
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="bg-white py-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm mb-6">
            Trusted by businesses across Nigeria
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            <p>✔ Retail Shops</p>
            <p>✔ Supermarkets</p>
            <p>✔ Schools</p>
            <p>✔ Hotels</p>
          </div>
        </div>
      </section>

      {/* ================= PROBLEM ================= */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-4 text-center">

          <h2 className="text-2xl font-semibold mb-8">
            Most Businesses Are Losing Money Daily…
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-gray-600 text-sm">
            <p>❌ You don’t know your exact daily profit</p>
            <p>❌ Staff steal or make mistakes</p>
            <p>❌ No control over inventory</p>
            <p>❌ Manual records are unreliable</p>
          </div>

        </div>
      </section>

      {/* ================= SOLUTION ================= */}
      <section className="bg-white py-14">
        <div className="max-w-5xl mx-auto px-4 text-center">

          <h2 className="text-2xl font-semibold mb-8">
            We Fix All That For You
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-gray-700 text-sm">
            <p>✅ Track every sale instantly</p>
            <p>✅ Know your profit anytime</p>
            <p>✅ Monitor stock automatically</p>
            <p>✅ Access your business from anywhere</p>
          </div>

        </div>
      </section>

      {/* ================= PACKAGES ================= */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">

          <h2 className="text-2xl font-semibold text-center mb-10">
            Choose Your Package
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {/* STARTER */}
            <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-lg mb-2">Starter</h3>
              <p className="text-green-600 font-bold mb-4">₦150,000</p>

              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>Offline POS system</li>
                <li>Inventory tracking</li>
                <li>Sales records</li>
                <li>Basic training</li>
              </ul>

              <a href={whatsappLink} className="block text-center bg-black text-white py-2 rounded">
                Choose Plan
              </a>
            </div>

            {/* BUSINESS */}
            <div className="border-2 border-green-500 rounded-xl p-6 shadow-lg scale-105">
              <h3 className="font-semibold text-lg mb-2">Business</h3>
              <p className="text-green-600 font-bold mb-4">₦250,000</p>

              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>Multi-user access</li>
                <li>Stock alerts</li>
                <li>Sales analytics</li>
                <li>Customer tracking</li>
              </ul>

              <a href={whatsappLink} className="block text-center bg-green-500 text-white py-2 rounded">
                Most Popular
              </a>
            </div>

            {/* PREMIUM */}
            <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-lg mb-2">Premium</h3>
              <p className="text-green-600 font-bold mb-4">₦350,000</p>

              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>Cloud system (online)</li>
                <li>Remote monitoring</li>
                <li>Multi-device login</li>
                <li>Full business control</li>
              </ul>

              <a href={whatsappLink} className="block text-center bg-black text-white py-2 rounded">
                Choose Plan
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* ================= TESTIMONIAL ================= */}
      <section className="bg-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">

          <h2 className="text-2xl font-semibold mb-6">
            What Business Owners Say
          </h2>

          <p className="text-gray-600 text-sm italic">
            “Before this system, I was losing money daily without knowing. Now I track everything and my profit has increased.”
          </p>

          <p className="mt-3 font-medium text-sm">
            — Shop Owner, Benin City
          </p>

        </div>
      </section>

      {/* ================= URGENCY ================= */}
      <section className="py-12 text-center">
        <p className="text-red-600 font-semibold">
          ⚠️ Limited slots available this week
        </p>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-black text-white text-center py-16">

        <h2 className="text-2xl font-semibold mb-4">
          Ready to Take Control of Your Business?
        </h2>

        <a
          href={whatsappLink}
          target="_blank"
          className="inline-flex items-center gap-2 bg-green-500 px-6 py-3 rounded-lg"
        >
          💬 Chat on WhatsApp Now
        </a>

      </section>

    </div>
  );
};

export default PosInstallation;