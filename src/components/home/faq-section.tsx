"use client"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    question: "What is CINE-HUB?",
    answer:
      "CINE-HUB is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
  },
  {
    question: "How much does CINE-HUB cost?",
    answer:
      "Watch CINE-HUB on your smartphone, tablet, smart TV, laptop, or streaming device, all for one fixed monthly price. Plans range from USD 7.99 to USD 22.99 a month.",
  },
  {
    question: "Where can I watch?",
    answer:
      "Watch anywhere, anytime. Sign in with your CINE-HUB account to watch instantly on the web at CINE-HUB.com from your personal computer or on any internet-connected device.",
  },
  {
    question: "How do I cancel?",
    answer:
      "CINE-HUB is flexible. There are no annoying contracts and no commitments. You can easily cancel your account online in two clicks.",
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="px-6 md:px-12 lg:px-20 py-16 bg-black">
      <h2 className="text-3xl font-bold text-white mb-12">Frequently Asked Questions</h2>

      <div className="max-w-2xl space-y-4">
        {faqs.map((faq, index) => (
          <button
            key={index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full text-left"
          >
            <div className="bg-gray-800 hover:bg-gray-700 transition px-6 py-4 rounded flex items-center justify-between group">
              <span className="text-lg font-semibold text-white">{faq.question}</span>
              <ChevronDown
                size={24}
                className={`text-red-600 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
              />
            </div>

            {openIndex === index && (
              <div className="bg-gray-900 px-6 py-4 text-gray-200 border-t border-gray-800">{faq.answer}</div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-300 mb-6">Ready to watch? Enter your email to create or restart your membership.</p>
        <div className="flex flex-col md:flex-row justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Email address"
            className="flex-1 px-4 py-3 bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded focus:outline-none focus:border-gray-400"
          />
          <button className="px-8 py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition flex items-center justify-center gap-2">
            Get Started
            <ChevronDown size={20} className="rotate-[-90deg]" />
          </button>
        </div>
      </div>
    </section>
  )
}
