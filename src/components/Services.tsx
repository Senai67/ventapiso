import React from 'react';
import { Code, Smartphone, Globe, Zap, Shield, Headphones, ArrowRight } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Code,
      title: 'Desarrollo Web',
      description: 'Aplicaciones web modernas y escalables con las últimas tecnologías.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Smartphone,
      title: 'Apps Móviles',
      description: 'Aplicaciones nativas y multiplataforma para iOS y Android.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Globe,
      title: 'E-Commerce',
      description: 'Tiendas online completas con sistemas de pago integrados.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Automatización',
      description: 'Procesos automatizados que optimizan tu flujo de trabajo.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Ciberseguridad',
      description: 'Protección avanzada para tus datos y sistemas críticos.',
      color: 'from-red-500 to-rose-500'
    },
    {
      icon: Headphones,
      title: 'Consultoría IT',
      description: 'Asesoramiento estratégico para tu transformación digital.',
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  return (
    <section id="servicios" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Nuestros Servicios
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrecemos soluciones tecnológicas completas para impulsar tu negocio hacia el futuro digital.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed mb-6">
                {service.description}
              </p>
              
              <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center space-x-2">
                <span>Saber más</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;