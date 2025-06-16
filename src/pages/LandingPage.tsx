import React from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/layout/Footer";

const LandingPage: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Book a Demo", href: "/demo" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
      ],
    },
  ];

  const socialLinks = [
    {
      label: "Twitter",
      href: "https://twitter.com/clubbix",
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/company/clubbix",
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
  ];

  const logo = <h1 className="text-2xl font-bold text-indigo-600">Clubbix</h1>;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-indigo-600">Clubbix</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2"
                >
                  Testimonials
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2"
                >
                  FAQ
                </button>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Add padding-top to account for fixed header */}
      <div className="pt-16">
        {/* Hero Section */}
        <div className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Create and manage</span>
                    <span className="block text-indigo-600">
                      your club's digital presence
                    </span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    All-in-one platform for clubs to build their website, manage
                    members, and grow their community.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link
                        to="/signup"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                      >
                        Create Your Club Site
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link
                        to="/demo"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                      >
                        Book a Demo
                      </Link>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                Features
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to run your club
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                {[
                  {
                    title: "Custom Website Builder",
                    description:
                      "Create a beautiful, responsive website for your club in minutes.",
                  },
                  {
                    title: "Member Management",
                    description:
                      "Easily manage members, track dues, and handle communications.",
                  },
                  {
                    title: "Event Calendar",
                    description:
                      "Schedule and promote events with built-in RSVP functionality.",
                  },
                  {
                    title: "Payment Processing",
                    description:
                      "Accept membership dues and event payments securely online.",
                  },
                ].map((feature) => (
                  <div key={feature.title} className="relative">
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      {/* Icon placeholder */}
                    </div>
                    <div className="ml-16">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Choose the plan that's right for your club
              </p>
            </div>

            <div className="mt-10 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto">
              {[
                {
                  name: "Starter",
                  price: "$29",
                  features: [
                    "Up to 50 members",
                    "Basic website builder",
                    "Event calendar",
                    "Email support",
                  ],
                },
                {
                  name: "Professional",
                  price: "$79",
                  features: [
                    "Up to 200 members",
                    "Advanced website builder",
                    "Member management",
                    "Payment processing",
                    "Priority support",
                  ],
                },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      {plan.name}
                    </h3>
                    <p className="mt-8">
                      <span className="text-4xl font-extrabold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-base font-medium text-gray-500">
                        /month
                      </span>
                    </p>
                    <Link
                      to="/signup"
                      className="mt-8 block w-full bg-indigo-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-indigo-700"
                    >
                      Get started
                    </Link>
                  </div>
                  <div className="pt-6 pb-8 px-6">
                    <ul className="space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-6 w-6 text-green-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <p className="ml-3 text-base text-gray-500">
                            {feature}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div id="testimonials" className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Trusted by clubs worldwide
              </h2>
            </div>
            <div className="mt-10">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    quote:
                      "Clubbix has transformed how we manage our club. The website builder is intuitive and the member management features are exactly what we needed.",
                    author: "Sarah Johnson",
                    role: "Club President",
                  },
                  {
                    quote:
                      "The event calendar and RSVP system has made organizing our club activities so much easier. Highly recommended!",
                    author: "Michael Chen",
                    role: "Event Coordinator",
                  },
                  {
                    quote:
                      "Our membership has grown by 40% since we started using Clubbix. The platform is perfect for clubs of any size.",
                    author: "Emily Rodriguez",
                    role: "Membership Director",
                  },
                ].map((testimonial) => (
                  <div
                    key={testimonial.author}
                    className="bg-white rounded-lg shadow-lg p-6"
                  >
                    <p className="text-gray-600 italic">
                      "{testimonial.quote}"
                    </p>
                    <div className="mt-4">
                      <p className="text-base font-medium text-gray-900">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="mt-10">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
                {[
                  {
                    question: "How easy is it to get started?",
                    answer:
                      "Getting started is simple! Sign up, choose a template, and customize it to match your club's branding. You can have a professional website up and running in under an hour.",
                  },
                  {
                    question: "Can I try before I buy?",
                    answer:
                      "Yes! We offer a 14-day free trial with full access to all features. No credit card required.",
                  },
                  {
                    question: "What kind of support do you offer?",
                    answer:
                      "We provide email support for all plans, with priority support for Professional plan subscribers. We also have an extensive knowledge base and video tutorials.",
                  },
                  {
                    question: "Can I upgrade or downgrade my plan?",
                    answer:
                      "Yes, you can change your plan at any time. Changes will be reflected in your next billing cycle.",
                  },
                ].map((faq) => (
                  <div key={faq.question}>
                    <dt className="text-lg leading-6 font-medium text-gray-900">
                      {faq.question}
                    </dt>
                    <dd className="mt-2 text-base text-gray-500">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer
          sections={footerSections}
          logo={logo}
          socialLinks={socialLinks}
          copyright={`© ${new Date().getFullYear()} Clubbix. All rights reserved.`}
        />
      </div>
    </div>
  );
};

export default LandingPage;
