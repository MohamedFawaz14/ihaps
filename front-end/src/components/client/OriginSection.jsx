import React from 'react';

export default function OriginSection() {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4 text-gray-900">Our Origin</h2>
          <p className="text-xl text-gray-600">
            Discover our journey and commitment to excellence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Video Section */}
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXQ"
              title="Ikhlas Housing & Properties - Company Overview"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <h3 className="text-2xl text-gray-900">
              Building Dreams Since 2021
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Founded in 2021, Ikhlas Housing & Properties emerged from a vision to transform the real estate landscape in Trichy. 
              With over 25+ years of combined experience in the industry, our team brings unparalleled expertise and 
              dedication to every project.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We have successfully delivered 30+ projects, creating homes for 5000+ happy families and developing 
              over 2.5 million square feet of premium residential spaces. Our commitment to quality, transparency, 
              and customer satisfaction has made us a trusted name in the real estate sector.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              At Ikhlas Housing & Properties, we don't just build plots; we create communities where families can thrive, 
              grow, and create lasting memories. Every project reflects our dedication to excellence and our 
              vision for a better tomorrow.
            </p>
            <div className="pt-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-gray-50 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-yellow-600">30+</div>
                  <div className="text-gray-600 font-medium">Projects Completed</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-yellow-50 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-gray-800">5000+</div>
                  <div className="text-gray-600 font-medium">Happy Families</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}