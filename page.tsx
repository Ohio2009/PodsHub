"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Filter, Heart, ShoppingCart, Star, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useFavorites } from "@/contexts/favorites-context"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Toast } from "@/components/toast"
import { useState } from "react"

export default function BuscarPage() {
  const { addItem } = useCart()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("relevante")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const filters = [
    { id: "bestseller", label: "Bestseller", count: 12 },
    { id: "nuevo", label: "Nuevo", count: 8 },
    { id: "descuento", label: "En Descuento", count: 5 },
    { id: "premium", label: "Premium", count: 15 },
  ]

  const products = [
    {
      id: 1,
      name: "PodsHub Auriculares Bluetooth (con reducción de ruido)",
      price: 15,
      originalPrice: 199,
      rating: 5,
      reviews: 128,
      image: "/images/podshub-bluetooth-earbuds.jpg",
      badges: ["descuento", "bestseller"],
    },
    {
      id: 2,
      name: "PodsHub Elite",
      price: 149,
      originalPrice: null,
      rating: 5,
      reviews: 89,
      image: "/placeholder.svg?height=250&width=300",
      badges: ["nuevo"],
    },
    {
      id: 3,
      name: "PodsHub Gaming",
      price: 129,
      originalPrice: 159,
      rating: 4,
      reviews: 67,
      image: "/placeholder.svg?height=250&width=300",
      badges: ["descuento"],
    },
    {
      id: 4,
      name: "PodsHub Sport",
      price: 99,
      originalPrice: null,
      rating: 4,
      reviews: 45,
      image: "/placeholder.svg?height=250&width=300",
      badges: ["nuevo"],
    },
  ]

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value)
  }

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) => (prev.includes(filterId) ? prev.filter((f) => f !== filterId) : [...prev, filterId]))
  }

  const handleAddToCart = (product: { id: number; name: string; price: number; image: string }) => {
    addItem(product)
    setToastMessage(`${product.name} agregado al carrito`)
    setShowToast(true)
  }

  const handleToggleFavorite = (product: {
    id: number
    name: string
    price: number
    image: string
    rating: number
    reviews: number
  }) => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id)
      setToastMessage(`${product.name} eliminado de favoritos`)
    } else {
      addFavorite(product)
      setToastMessage(`${product.name} agregado a favoritos`)
    }
    setShowToast(true)
  }

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilters =
        selectedFilters.length === 0 || selectedFilters.some((filter) => product.badges.includes(filter))
      return matchesSearch && matchesFilters
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "precio-asc":
          return a.price - b.price
        case "precio-desc":
          return b.price - a.price
        case "valoracion":
          return b.rating - a.rating
        default:
          return 0
      }
    })

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "bestseller":
        return "bg-purple-600"
      case "nuevo":
        return "bg-green-600"
      case "descuento":
        return "bg-red-600"
      case "premium":
        return "bg-yellow-600"
      default:
        return "bg-gray-600"
    }
  }

  const getBadgeLabel = (badge: string) => {
    switch (badge) {
      case "bestseller":
        return "Bestseller"
      case "nuevo":
        return "Nuevo"
      case "descuento":
        return "Descuento"
      case "premium":
        return "Premium"
      default:
        return badge
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <ScrollToTop />
      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <Image src="/images/podshub-logo.jpg" alt="PodsHub Logo" width={120} height={40} className="h-8 w-auto" />
            </Link>
            <Link href="/">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-orange-400">Buscar</span> Productos
            </h1>
            <p className="text-xl text-gray-300 mb-8">Encuentra exactamente lo que necesitas</p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar auriculares..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900 border-gray-800 sticky top-24">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Filter className="w-5 h-5 text-orange-400" />
                    <h3 className="text-xl font-bold">Filtros</h3>
                  </div>

                  <div className="space-y-3">
                    {filters.map((filter) => (
                      <div key={filter.id} className="flex items-center justify-between">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFilters.includes(filter.id)}
                            onChange={() => toggleFilter(filter.id)}
                            className="w-4 h-4 text-orange-600 bg-gray-800 border-gray-600 rounded focus:ring-orange-500"
                          />
                          <span className="text-gray-300">{filter.label}</span>
                        </label>
                        <span className="text-sm text-gray-500">({filter.count})</span>
                      </div>
                    ))}
                  </div>

                  {selectedFilters.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFilters([])}
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        Limpiar Filtros
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <p className="text-gray-400">
                  {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} encontrado
                  {filteredProducts.length !== 1 ? "s" : ""}
                </p>
                <select
                  className="bg-gray-900 border-gray-700 text-white rounded px-3 py-2"
                  onChange={handleSortChange}
                  value={sortBy}
                >
                  <option value="relevante">Más relevante</option>
                  <option value="precio-asc">Precio: menor a mayor</option>
                  <option value="precio-desc">Precio: mayor a menor</option>
                  <option value="valoracion">Mejor valorados</option>
                </select>
              </div>

              {filteredProducts.length === 0 ? (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-8 h-8 text-orange-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">No se encontraron productos</h2>
                    <p className="text-gray-400 mb-8">Intenta con otros términos de búsqueda o filtros</p>
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedFilters([])
                      }}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Limpiar Búsqueda
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="bg-gray-900 border-gray-800 hover:border-orange-500 transition-all duration-300 group"
                    >
                      <CardContent className="p-6">
                        <div className="relative mb-6">
                          {product.badges.map((badge, index) => (
                            <Badge
                              key={badge}
                              className={`absolute top-2 ${index === 0 ? "left-2" : "left-20"} z-10 ${getBadgeColor(badge)}`}
                            >
                              {getBadgeLabel(badge)}
                            </Badge>
                          ))}
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={300}
                            height={250}
                            className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                                />
                              ))}
                            </div>
                            <span className="text-gray-400 text-sm">({product.reviews} reseñas)</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl font-bold text-orange-400">€{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-lg text-gray-500 line-through">€{product.originalPrice}</span>
                            )}
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Button
                              className="flex-1 bg-orange-600 hover:bg-orange-700"
                              onClick={() => handleAddToCart(product)}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Agregar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className={`hover:bg-gray-800 bg-transparent ${
                                isFavorite(product.id) ? "text-red-400 border-red-400" : "text-white border-white"
                              }`}
                              onClick={() => handleToggleFavorite(product)}
                            >
                              <Heart className={`w-4 h-4 ${isFavorite(product.id) ? "fill-red-400" : ""}`} />
                            </Button>
                          </div>
                          <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                            <Truck className="w-4 h-4" />
                            <span>Envío gratuito en España</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Image
              src="/images/podshub-logo.jpg"
              alt="PodsHub Logo"
              width={120}
              height={40}
              className="h-8 w-auto mx-auto mb-4"
            />
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} PodsHub. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
