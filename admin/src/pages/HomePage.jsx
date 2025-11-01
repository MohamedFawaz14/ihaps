import React from 'react';
import  CarouselSection  from '../components/client/CarouselSection.jsx';
import  ServicesSection  from '../components/client/ServicesSection.jsx';
import  VenturesSection  from '../components/client/VenturesSection.jsx';
import  AchievementsSection  from '../components/client/AchievementsSection.jsx';
import  TestimonialsSection  from '../components/client/TestimonialsSection.jsx';
import  BlogSection  from '../components/client/BlogSection.jsx';
import  ContactForm  from '../components/client/ContactForm.jsx';
import { Toaster } from 'sonner';

export default function HomePage() {
  return (
    <>
    <Toaster/>
      <CarouselSection />
      <VenturesSection />
      <AchievementsSection />
      <TestimonialsSection />
      <ServicesSection />
      <BlogSection />
      <ContactForm />
    </>
  );
}