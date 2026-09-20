import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles, ShoppingBag, User, Shirt,
  Camera, Calendar, Heart, MessageSquare, Sparkle, Store
} from 'lucide-react'
import Card from '../Home/Card'
import { useAuth } from '../ContextAPI/AuthApi/authUse'

function Home() {

  const { userRole } = useAuth()

  const navigate = useNavigate()

  const mainCards = [
    {
      title: 'AI Personal Stylist ✨',
      desc: 'Get personalized outfit recommendations using your style profile and wardrobe.',
      icon: <Sparkles size={22} />,
      path: '/ai-stylist',
      dark: true,
    },
    {
      title: 'Shop with Oryanta 🛍️',
      desc: 'Discover clothes, shoes and fashion products curated for your style.',
      icon: <ShoppingBag size={22} />,
      path: '/shopList',
    },
    {
      title: 'My Fashion Profile',
      desc: 'Save your skin tone, body shape, height and personal fashion style.',
      icon: <User size={22} />,
      path: '/profile',
    },
  ]

  const tools = [
    {
      title: 'Digital Wardrobe',
      desc: 'Add and organize your clothes digitally.',
      icon: <Shirt size={22} />,
      path: '/wardrobe',
    },
    {
      title: 'Virtual Try-On',
      desc: 'See how an outfit could look on you.',
      icon: <Camera size={22} />,
      path: '/try-on',
    },
    {
      title: 'Weekly Outfit Planner',
      desc: 'Plan your outfits for the entire week.',
      icon: <Calendar size={22} />,
      path: '/planner',
    },
    {
      title: 'Wishlist',
      desc: 'Save your favourite fashion items.',
      icon: <Heart size={22} />,
      path: '/wishlist',
    },
    {
      title: 'FashBot',
      desc: 'Chat with your personal fashion assistant.',
      icon: <MessageSquare size={22} />,
      path: '/fashbot',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header section with title and profile button */}

      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold tracking-wide text-gray-900">ORYANTA</h1>
        <button
          onClick={() => navigate('/profile')}
          className="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <User size={22} className="text-gray-800" />
        </button>
      </div>

      <div className="px-6 pt-2 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Hey, Style Lover 👋
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Let Oryanta help you dress better, every day.
        </p>
      </div>

      {/* card components for main features */}

      <div className="px-6 space-y-4">
        {mainCards.map((card, i) => (
          <Card key={i} {...card} onClick={() => navigate(card.path)} />
        ))}
      </div>

      <div className="px-6 mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Your Oryanta Tools
        </h3>
        <div className="space-y-4">
          {tools.map((tool, i) => (
            <Card key={i} {...tool} onClick={() => navigate(tool.path)} />
          ))}
        </div>
      </div>

      {/* show only when user is seller */}
      {userRole === 'seller' && (
        <div className="px-6 mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            For Your Brand
          </h3>
          <Card
            title="Brand Portal 🏪"
            desc="Manage your products and grow your brand on Oryanta."
            icon={<Store size={22} />}
            dark={true}
            onClick={() => navigate('/brand-portal')}
          />
        </div>
      )}

      {/* footer section with description about Oryanta*/}

      <div className="px-6 my-8">
        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6">
          <Sparkle size={22} className="text-gray-900 mb-2" />
          <h3 className="text-lg font-bold text-gray-900">
            Fashion, personalized for you.
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Oryanta brings your wardrobe, personal styling, shopping and fashion discovery together in one place.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home