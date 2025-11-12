"use client"

import { Tv, Download, Play, Users } from "lucide-react"

const features = [
  {
    title: "Enjoy on your TV",
    description: "Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more.",
    icon: Tv,
    image: "/tv-screen-entertainment.jpg",
  },
  {
    title: "Download your series to watch offline",
    description: "Save your favorites easily and always have something to watch.",
    icon: Download,
    image: "/download-offline-mobile-app.jpg",
  },
  {
    title: "Watch everywhere",
    description: "Stream unlimited films and series on your phone, tablet, laptop and TV.",
    icon: Play,
    image: "/watch-on-mobile-devices.jpg",
  },
  {
    title: "Create profiles for children",
    description:
      "Send children on adventures with their favorite characters in a space made just for them – free with your membership.",
    icon: Users,
    image: "/kids-profiles-cartoon-characters.jpg",
  },
]

export default function FeaturesSection() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-16 bg-black">
      <h2 className="text-3xl font-bold text-white mb-12">More reasons to join</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div
              key={index}
              className="bg-gradient-to-br from-purple-900/20 to-black border border-gray-800 rounded-2xl p-8 hover:border-gray-600 transition"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
              <div className="h-24 rounded-lg overflow-hidden opacity-60">
                <Icon className="w-full h-full text-purple-400" strokeWidth={1} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
