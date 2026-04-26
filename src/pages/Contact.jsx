import { useState } from "react";

const Contact = () => {
  const phone = "2348129097599";

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello, my name is ${form.name || "Customer"}.\n\n${form.message || "I want to make an inquiry."}`
    );

    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-2">
          Contact Us
        </h1>

        <p className="text-gray-500 mb-8">
          We’re here to help. Reach out to us anytime.
        </p>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* LEFT - CONTACT INFO */}
          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">

            <div>
              <h2 className="font-semibold text-lg mb-2">Customer Support</h2>
              <p className="text-sm text-gray-500">
                Fast response via WhatsApp
              </p>

              <button
                onClick={handleWhatsApp}
                className="mt-3 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg"
              >
                Chat on WhatsApp
              </button>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-2">Call Us</h2>
              <p className="text-sm text-gray-600">+234 812 909 7599</p>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-2">Store Locations</h2>

              <div className="text-sm text-gray-600 space-y-1">
                <p>100 Mission Road — 08063215473</p>
                <p>102 Mission Road — 07062317895</p>
                <p>75 Mission Road — 08145424165</p>
                <p>80 Mission Road — 08179736442</p>
              </div>
            </div>

          </div>

          {/* RIGHT - FORM */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">

            <h2 className="font-semibold text-lg mb-4">
              Send a Message
            </h2>

            <div className="space-y-4">

              <input
                placeholder="Your Name"
                className="w-full border p-3 rounded"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                placeholder="Your Email"
                className="w-full border p-3 rounded"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <textarea
                placeholder="Your Message"
                rows={5}
                className="w-full border p-3 rounded"
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
              />

              <button
                onClick={handleWhatsApp}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
              >
                Send via WhatsApp
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Contact;