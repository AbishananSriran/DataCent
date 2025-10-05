import React from "react";
import Navbar from "../components/Navbar";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function Landing() {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Hero Text */}
          <div>
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Smart Network Infrastructure
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Networks Designed for <span className="text-blue-600">Real Traffic,</span>{" "}
              <span className="text-green-600">Real Savings</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              DataCent analyzes your enterprise's network traffic patterns to design infrastructure that's efficient, cost-effective, and environmentally sustainable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg font-medium" onClick={() => user.isLoggedIn ? navigate("/projects") : navigate("/login")}>
                <span>Request Free Analysis</span>
                <span className="inline-block w-5 h-5 border-r-2 border-t-2 border-white transform rotate-45"></span>
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all font-medium">
                Watch Demo
              </button>
            </div>
            <div className="mt-8 flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-green-600 rounded-full"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-green-600 rounded-full"></div>
                <span>14-day free trial</span>
              </div>
            </div>
          </div>

          {/* Right Stats Boxes */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="w-10 h-10 bg-blue-600 rounded-full mb-3"></div>
                <div className="text-3xl font-bold text-gray-900 mb-1">45%</div>
                <div className="text-sm text-gray-600 font-medium">Cost Reduction</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl">
                <div className="w-10 h-10 bg-yellow-500 rounded-full mb-3"></div>
                <div className="text-3xl font-bold text-gray-900 mb-1">60%</div>
                <div className="text-sm text-gray-600 font-medium">Energy Savings</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <div className="w-10 h-10 bg-green-600 rounded-full mb-3"></div>
                <div className="text-3xl font-bold text-gray-900 mb-1">70%</div>
                <div className="text-sm text-gray-600 font-medium">Lower Emissions</div>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl">
                <div className="w-10 h-10 bg-gray-600 rounded-full mb-3"></div>
                <div className="text-3xl font-bold text-gray-900 mb-1">99.9%</div>
                <div className="text-sm text-gray-600 font-medium">Uptime SLA</div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-5xl font-bold mb-2">500+</div>
            <div className="text-gray-400">Enterprise Networks Optimized</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">$2.4B</div>
            <div className="text-gray-400">Total Cost Savings Delivered</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">18M KWh</div>
            <div className="text-gray-400">Energy Saved, Helping the Planet</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Three Pillars of Smart Infrastructure</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            DataCent's data-driven approach ensures your network infrastructure is optimized across every dimension that matters.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Cost-Effective",
              color: "bg-blue-600",
              desc: "Reduce infrastructure costs by up to 45% with right-sized network solutions."
            },
            {
              title: "Highly Efficient",
              color: "bg-yellow-500",
              desc: "Maximize performance with intelligent traffic routing and dynamic bandwidth allocation."
            },
            {
              title: "Environmentally Friendly",
              color: "bg-green-600",
              desc: "Reduce your carbon footprint by up to 70% with energy-efficient infrastructure."
            },
          ].map((pillar, idx) => (
            <div key={idx} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100">
              <div className={`w-16 h-16 ${pillar.color} rounded-full flex items-center justify-center mb-6`}></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{pillar.title}</h3>
              <p className="text-gray-600 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800 px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Network?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Get a free network traffic analysis and discover how much you could save with DataCent's intelligent infrastructure design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="bg-white text-blue-600 px-10 py-4 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg font-semibold text-lg" onClick={() => { user.isLoggedIn ? navigate("/projects") : navigate("/login") }}>
              Get Free Analysis
            </button>
              <button className="border-2 border-white text-white px-10 py-4 rounded-lg hover:bg-white/10 transition-all font-semibold text-lg">
                <a
              href="mailto:sales@datacent.io?subject=Network%20Consultation&body=I%20wanted%20to%20reach%20out%20to%20schedule%20a%20consultation%20regarding%20DataCent's%20services."
            >Schedule Consultation</a>
              </button>
          </div>
          <p className="text-blue-200 text-sm">
            Join 500+ enterprises saving millions while protecting the planet
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
