const Repairs = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-4">Device Repairs</h1>

      <p className="text-gray-600 mb-4">
        We repair laptops, printers, and other gadgets quickly and professionally.
      </p>

      <ul className="mb-6 text-gray-600">
        <li>✔ Laptop repairs</li>
        <li>✔ Printer servicing</li>
        <li>✔ Software fixes</li>
      </ul>

      <a href="https://wa.me/2348179736442">
        <button className="bg-green-600 text-white px-6 py-2 rounded">
          Request Repair
        </button>
      </a>

    </div>
  );
};

export default Repairs;