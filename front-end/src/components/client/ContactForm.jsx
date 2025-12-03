import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: ''
  });
   const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    try {
      const response  = await axios.post(`${SERVER_URL}/contactForm`,{formData});
      // console.log(response.message);
      Swal.fire({
        title: `Thank you for your enquiry!`,
        text: "Our team will contact you within 2-3 business days.",
        icon: "success",
        timer : 2500,
        showConfirmButton : false
      })
    } catch (error) {
      console.log(error)
    }
    
  };

  return (
  <section
  id="contact"
  className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-white py-20"
>
  <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Section Heading */}
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl mb-4 text-[#1e3a8a] font-semibold">
        Contact Us for Your Enquiries
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Our expert team will connect you within 2–3 business days. Visit our office or get in touch online.
      </p>
    </div>

    {/* Contact Form */}
    <div className="bg-white shadow-xl rounded-xl p-10 border border-gray-100 w-full">
      <h3 className="text-2xl mb-6 text-[#1e3a8a] font-semibold text-center">Send Us a Message</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block mb-2 text-[#1e3a8a] font-medium">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-2 text-[#1e3a8a] font-medium">Phone Number</label>
            <input
            type="number"
            id="phone"
            name="phone"
            value={formData.phone}
            pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
            onChange={handleInputChange}
            required
            className="input-no-spinner w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
            placeholder="Enter your phone number"
/>

          </div>
        </div>

        <div>
          <label htmlFor="email" className="block mb-2 text-[#1e3a8a] font-medium">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <label htmlFor="type" className="block mb-2 text-[#1e3a8a] font-medium">Enquiry Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
          >
            <option value="">Select enquiry type</option>
            <option value="plot-booking">Plot Booking</option>
            <option value="site-visit">Site Visit</option>
            <option value="general-inquiry">General Inquiry</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#d4af37] to-[#ffd700] hover:from-[#b8941f] hover:to-[#e6c200] text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <Send className="h-5 w-5" />
          <span>Submit Enquiry</span>
        </button>
      </form>
    </div>

    {/* Google Map Below */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-16 w-full">
      <div className="p-6 border-b border-gray-100 text-center">
        <h3 className="text-2xl text-[#1e3a8a] mb-2 font-semibold">Find Us on Map</h3>
        <p className="text-gray-600">Visit our office for personalized consultation and property tours.</p>
      </div>
      <div className="h-[450px] relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.772726965345!2d78.68119234011114!3d10.82869705827055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baaf5007eaa46b9%3A0x45e67df5090dea8d!2sIKHLAS%20HOUSING%20%26%20PROPERTIES!5e0!3m2!1sen!2sin!4v1760266061316!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          className="absolute inset-0"
        />
      </div>
    </div>
  </div>
</section>



  );
}