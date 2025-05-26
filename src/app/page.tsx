"use client"
import React, { useState, useEffect } from 'react';
import { ArrowRight, Shield, Zap, Users, Menu, X, Star, ChevronDown } from 'lucide-react';

export default function BlaffaLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
 // const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Bank-Grade Security",
      description: "Your transactions are protected with military-grade encryption and multi-layer security protocols."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Deposits & Withdrawals",
      description: "Deposit to betting platforms instantly or withdraw your winnings with our lightning-fast processing technology."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Our dedicated support team is available around the clock to assist with any questions."
    }
  ];

  const stats = [
    { number: "500K+", label: "Active Users" },
    { number: "$50M+", label: "Transferred Monthly" },
    { number: "99.9%", label: "Uptime" },
    { number: "150+", label: "Supported Platforms" }
  ];

  const testimonials = [
    {
      name: "Marcus Chen",
      role: "Professional Trader",
      content: "Blaffa has revolutionized how I manage my betting funds. Deposits are instant and withdrawals are seamless.",
      rating: 5
    },
    {
      name: "Sarah Williams",
      role: "Sports Enthusiast", 
      content: "Finally, a platform that understands the needs of serious bettors. Seamless experience every time.",
      rating: 5
    },
    {
      name: "David Rodriguez",
      role: "Finance Professional",
      content: "The security features give me complete peace of mind. This is how financial transfers should work.",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "How fast are deposits and withdrawals?",
      answer: "Most deposits are completed within seconds. Withdrawals typically take 2-5 minutes depending on the betting platform and verification requirements."
    },
    {
      question: "Is my money safe with Blaffa?",
      answer: "Absolutely. We use bank-grade security, are fully regulated, and maintain insurance coverage for all user funds."
    },
    {
      question: "What are your fees?",
      answer: "We offer competitive rates starting from 0.5% per transaction, with volume discounts available for frequent users."
    },
    {
      question: "Which betting platforms do you support?",
      answer: "We support over 150 major betting platforms worldwide, with new integrations added regularly."
    }
  ];

  const [openFaq, setOpenFaq] = useState(-1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-700' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="Blaffa Logo" className="w-15 h-15" >
              </img>
              <span className="text-2xl font-bold">Blaffa</span>
            </div>
            
            <div className="hidden md:flex items-center">
              <a href='/auth' className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
                Get Started
              </a>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-700">
            <div className="px-4 py-4">
              <a href='/auth' className="w-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
                  🚀 Trusted by 500,000+ Users
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  The Future of
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Betting </span>
                  Deposits & Withdrawals
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed">
                  Deposit to and withdraw from your favorite betting platforms instantly and securely. 
                  Join thousands of users who trust Blaffa for seamless betting transactions.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 font-semibold">
                  <a href='/auth'>Start Banking</a>
                  <ArrowRight className="w-5 h-5" />
                </button>
                {/* <button className="border border-slate-500 px-8 py-4 rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center space-x-2">
                  <span>Watch Demo</span>
                </button> */}
              </div>

              <div className="flex items-center space-x-8 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{stat.number}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Quick Transfer</h3>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-800 rounded-lg p-4">
                      <label className="text-sm text-slate-400">Amount</label>
                      <div className="text-2xl font-bold">XOF</div>
                    </div>
                    
                    <div className="bg-slate-800 rounded-lg p-4">
                      <label className="text-sm text-slate-400">To Platform</label>
                      <div className="text-lg font-semibold">1xbet</div>
                    </div>
                    
                    {/* <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all">
                      Transfer Now
                    </button> */}
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Why Choose Blaffa?</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {("We've built the most secure, fast, and reliable platform for betting deposits and withdrawals")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all hover:transform hover:scale-105">
                <div className="text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Trusted by Professionals</h2>
            <p className="text-xl text-slate-300">See what our users say about Blaffa</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 italic">{testimonial.content}</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-slate-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-300">Everything you need to know about Blaffa</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-700/50 transition-all"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-12 rounded-2xl space-y-6">
            <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100">
              Join thousands of users who trust Blaffa for secure, instant betting deposits and withdrawals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href='/auth' className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 font-semibold">
                Create Free Account
              </a>
              <button className="border border-white/30 px-8 py-4 rounded-lg hover:bg-white/10 transition-all">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 border-t border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img src="/logo.png" alt="Blaffa Logo" className="w-15 h-15" >
              </img>
                <span className="text-xl font-bold">Blaffa</span>
              </div>
              <p className="text-slate-400">
                The most trusted platform for betting deposits and withdrawals worldwide.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-slate-400">
                <div>Features</div>
                <div>Security</div>
                <div>Pricing</div>
                <div>API</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-slate-400">
                {/* <div>About</div>
                <div>Careers</div>
                <div>Press</div>
                <div>Contact</div> */}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-slate-400">
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
                <div>Compliance</div>
                <div>Licenses</div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Blaffa. All rights reserved. Licensed and regulated financial service provider.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}