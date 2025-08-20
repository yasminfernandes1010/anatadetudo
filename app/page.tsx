"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  Heart,
  Star,
  Plus,
  Minus,
  Filter,
  ChevronDown,
  Clock,
  Shield,
  Truck,
  CreditCard,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"

export default function ToyStorePage() {
  const [sortBy, setSortBy] = useState("relevance")
  const [priceRange, setPriceRange] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(3600) // 1 hour countdown
  const [showCepPopup, setShowCepPopup] = useState(false)
  const [showFretePopup, setShowFretePopup] = useState(false) // Added state for frete gratis popup
  const [cep, setCep] = useState("")
  const [userName, setUserName] = useState("")
  const [displayUserName, setDisplayUserName] = useState("")
  const [showCart, setShowCart] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [displayCep, setDisplayCep] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 3600))
    }, 1000)

    // Show CEP popup after 3 seconds
    const popupTimer = setTimeout(() => {
      setShowCepPopup(true)
    }, 3000)

    return () => {
      clearInterval(timer)
      clearTimeout(popupTimer)
    }
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 8)
    if (numbers.length > 5) {
      return `${numbers.slice(0, 5)}-${numbers.slice(5)}`
    }
    return numbers
  }

  const handleCepSubmit = () => {
    if (cep.replace(/\D/g, "").length >= 8 && userName.trim()) {
      setDisplayCep(cep)
      setDisplayUserName(userName.trim())
      setShowCepPopup(false)
      setShowFretePopup(true)
    }
  }

  const handleVerProdutos = () => {
    setShowFretePopup(false)
  }

  const handleAddToCart = (product: any, quantity = 1) => {
    const existingItem = cartItems.find((item) => item.id === product.id)

    if (existingItem) {
      setCartItems(
        cartItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)),
      )
    } else {
      setCartItems([...cartItems, { ...product, quantity }])
    }

    setCartCount((prev) => prev + quantity)
    setShowCart(true) // Auto-open cart
  }

  const removeFromCart = (productId: number) => {
    const item = cartItems.find((item) => item.id === productId)
    if (item) {
      setCartItems(cartItems.filter((item) => item.id !== productId))
      setCartCount((prev) => prev - item.quantity)
    }
  }

  const updateCartQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    const oldItem = cartItems.find((item) => item.id === productId)
    if (oldItem) {
      setCartItems(cartItems.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
      setCartCount((prev) => prev - oldItem.quantity + newQuantity)
    }
  }

  const cartTotal = cartItems.reduce((total, item) => {
    return total + Number.parseFloat(item.salePrice.replace(",", ".")) * item.quantity
  }, 0)

  return (
    <div className="min-h-screen bg-white">
      {/* CEP Popup */}
      {showCepPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-md w-full">
            <img src="/popup-disney-cep.png" alt="Popup Disney CEP" className="w-full h-auto rounded-2xl shadow-2xl" />

            {/* Close button overlay */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCepPopup(false)}
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2"
            ></Button>

            <div className="absolute bottom-28 left-6 right-6 space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Como você gostaria de ser chamado?"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-6 py-4 rounded-xl text-gray-800 placeholder-gray-500 text-center font-bold text-lg border-2 border-white shadow-lg"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Digite o seu CEP"
                  value={cep}
                  onChange={(e) => setCep(formatCep(e.target.value))}
                  className="w-full px-6 py-4 rounded-xl text-gray-800 placeholder-gray-500 text-center font-bold text-lg border-2 border-white shadow-lg"
                />
              </div>
              <Button
                onClick={handleCepSubmit}
                disabled={!userName.trim() || cep.replace(/\D/g, "").length < 8}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl text-xl shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                QUERO OFERTAS ⚡
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Frete Gratis Popup */}
      {showFretePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-md w-full">
            <img
              src="/frete-gratis-popup-novo.png"
              alt="Você Ganhou Frete Grátis"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />

            {/* Close button overlay */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFretePopup(false)}
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Ver Produtos button overlay */}
            <div className="absolute bottom-24 left-4 right-4">
              <Button
                onClick={handleVerProdutos}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-6 px-8 rounded-full text-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse"
              >
                VER PRODUTOS
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-lg">Carrinho</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowCart(false)} className="hover:bg-gray-100">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 pb-4 border-b">
                  <img
                    src={item.image || "/placeholder.svg?height=80&width=80"}
                    alt={item.name}
                    className="w-16 h-16 object-contain bg-gray-50 rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-800 mb-2 line-clamp-2">{item.name}</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-300 rounded">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 p-0 hover:bg-gray-100 text-white bg-green-600 rounded-full"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0 hover:bg-gray-100 text-white bg-green-600 rounded-full"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">R$ {item.salePrice}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {cartItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Seu carrinho está vazio</p>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-4 border-t bg-gray-50 mt-auto">
                <div className="bg-white rounded-lg p-4 mb-4">
                  <h4 className="font-bold text-lg mb-3">Resumo do pedido</h4>
                  <div className="text-center mb-3">
                    <a href="#" className="text-blue-600 underline text-sm">
                      Aplicar cupom de desconto
                    </a>
                  </div>
                  <p className="text-xs text-gray-600 mb-4">
                    Válida apenas para produtos vendidos e entregues por Ri Happy.{" "}
                    <a href="#" className="text-blue-600 underline">
                      Saiba mais
                    </a>
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg">R$ {cartTotal.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 mb-2">
                    🔒 continuar para pagamento
                  </Button>
                  <Button variant="outline" className="w-full text-sm bg-transparent">
                    ver carrinho e lojas para retirada
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trust Bar */}
      <div className="bg-green-600 text-white py-2 px-6 text-center">
        <div className="flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Compra 100% Segura</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            <span>Frete Grátis Brasil</span>
          </div>
          <div className="flex items-center gap-2"></div>
        </div>
      </div>

      {/* Header - Following RiHappy yellow design */}
      <header className="bg-yellow-400 text-gray-800 py-4 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/rihappy-logo.png" alt="RiHappy" className="h-8 w-auto" />
            {displayCep && (
              <div className="bg-yellow-300 border-2 border-yellow-600 text-gray-800 px-4 py-2 rounded-full text-sm font-bold">
                ⚡ Entregar em: {displayCep}
              </div>
            )}
            <div className="hidden md:flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm animate-pulse">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">Oferta acaba em: {formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative"></div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm">
              {displayUserName ? `Olá, ${displayUserName} seja bem vindo!` : "Olá, acesse sua conta"}
            </span>
            <Button variant="ghost" size="sm" className="text-gray-800 hover:bg-yellow-300">
              <Heart className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-800 hover:bg-yellow-300 relative"
              onClick={() => setShowCart(true)}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-100 py-2 px-6 border-b">
        <div className="max-w-7xl mx-auto flex items-center gap-6 text-sm">
          <span className="text-gray-600">compre por idade</span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
          <span className="font-semibold text-gray-800">3 a 5anos</span>
          <span className="text-gray-600 ml-auto">3 a 5anos</span>
        </div>
      </nav>

      {/* Main Banner - Following RiHappy blue design */}
      <section className="bg-gradient-to-r from-cyan-400 to-blue-500 py-8 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex-1">
            <div className="text-white">
              <div className="animate-text-glow">
                <img
                  src="/presente-certo-banner.png"
                  alt="Presente Certo na Idade Certa"
                  className="w-[400px] h-auto mb-6"
                />
              </div>
              <div className="flex items-center gap-4 mt-6">
                <span className="text-white text-2xl">de</span>
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full text-4xl font-bold shadow-lg">
                  3 a 5
                </div>
                <span className="text-white text-2xl">Anos</span>
              </div>
            </div>
          </div>
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <img
              src="/crianca-3-5-anos.png"
              alt="Criança feliz com brinquedos"
              className="w-[1680px] h-auto object-contain drop-shadow-2xl animate-float"
            />
          </div>
        </div>
        <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-pink-300 rounded-full opacity-20 animate-pulse"></div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-2">MEGA LIQUIDAÇÃO!</h3>
          <p className="text-2xl font-semibold mb-4">TODO O SITE COM 70% DE DESCONTO!</p>
          <div className="flex justify-center items-center gap-6 flex-wrap">
            <Badge className="bg-red-600 text-white px-4 py-2 font-semibold animate-pulse">ÚLTIMAS HORAS!</Badge>
            <Badge className="bg-green-600 text-white px-4 py-2 font-semibold">FRETE GRÁTIS</Badge>
            <Badge className="bg-yellow-500 text-black px-4 py-2 font-semibold">ECONOMIA GARANTIDA</Badge>
            <Badge className="bg-green-600 text-white px-4 py-2 font-semibold">ENTREGA RÁPIDA</Badge>
            <Badge className="bg-blue-600 text-white px-4 py-2 font-semibold">EMBRULHO GRÁTIS</Badge>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-8 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Compra Segura</h4>
              <p className="text-sm text-gray-600">Seus dados protegidos com certificado SSL</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Entrega Rápida</h4>
              <p className="text-sm text-gray-600">Receba em casa com frete grátis</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Satisfação Garantida</h4>
              <p className="text-sm text-gray-600">30 dias para troca ou devolução</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-4 px-6 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </Button>

              <div
                className={`flex items-center gap-4 transition-all ${showFilters ? "opacity-100" : "opacity-0 max-w-0 overflow-hidden"}`}
              >
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="all">Todos os preços</option>
                  <option value="0-50">Até R$ 50</option>
                  <option value="50-100">R$ 50 - R$ 100</option>
                  <option value="100-200">R$ 100 - R$ 200</option>
                  <option value="200+">Acima de R$ 200</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-gray-700">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-white"
              >
                <option value="relevance">Relevância</option>
                <option value="price-low">Menor preço</option>
                <option value="price-high">Maior preço</option>
                <option value="rating">Melhor avaliação</option>
                <option value="name">Nome A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products-section" className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h4 className="text-3xl font-bold text-gray-800 mb-2">Brinquedos em Promoção</h4>
            <p className="text-lg text-gray-600">Diversão garantida para crianças de 3 a 5 anos</p>
            <div className="flex justify-center gap-4 mt-4">
              <Badge className="bg-red-500 text-white px-4 py-2">{getAllProducts().length} produtos disponíveis</Badge>
              <Badge className="bg-green-500 text-white px-4 py-2">Todos com 70% OFF</Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getFilteredProducts(sortBy, priceRange).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(quantity) => handleAddToCart(product, quantity)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400"></div>
        <div className="absolute top-10 right-10 w-16 h-16 bg-yellow-300/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-12 h-12 bg-pink-300/20 rounded-full animate-bounce"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="text-center md:text-left">
              <img src="/rihappy-logo-colorida.svg" alt="RiHappy" className="h-16 w-auto mb-4 mx-auto md:mx-0" />
              <p className="text-gray-200 mb-4 text-base font-medium">
                Os melhores brinquedos para o desenvolvimento e diversão das crianças
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-green-400 bg-green-900/30 rounded-full px-4 py-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-semibold">Loja 100% Segura</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg text-yellow-300 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Atendimento
              </h4>
              <ul className="space-y-3 text-sm text-gray-200">
                <li>
                  <a
                    href="#"
                    className="hover:text-yellow-300 transition-colors flex items-center gap-2 p-2 rounded hover:bg-white/10"
                  >
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-yellow-300 transition-colors flex items-center gap-2 p-2 rounded hover:bg-white/10"
                  >
                    Trocas e Devoluções
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-yellow-300 transition-colors flex items-center gap-2 p-2 rounded hover:bg-white/10"
                  >
                    Política de Privacidade
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-yellow-300 transition-colors flex items-center gap-2 p-2 rounded hover:bg-white/10"
                  >
                    Termos de Uso
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg text-green-300 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Pagamento
              </h4>
              <ul className="space-y-3 text-sm text-gray-200">
                <li className="flex items-center gap-2 p-2 bg-white/5 rounded">Cartão de Crédito</li>
                <li className="flex items-center gap-2 p-2 bg-white/5 rounded">Cartão de Débito</li>
                <li className="flex items-center gap-2 p-2 bg-white/5 rounded">PIX</li>
                <li className="flex items-center gap-2 p-2 bg-white/5 rounded">Boleto Bancário</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg text-blue-300 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Entrega
              </h4>
              <ul className="space-y-3 text-sm text-gray-200">
                <li className="flex items-center gap-2 p-2 bg-white/5 rounded">Frete Grátis Brasil</li>
                <li className="flex items-center gap-2 p-2 bg-white/5 rounded">Entrega Expressa</li>
                <li className="flex items-center gap-2 p-2 bg-white/5 rounded">Retirada na Loja</li>
                <li className="flex items-center gap-2 p-2 bg-white/5 rounded">Rastreamento Online</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 mb-6">
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Produtos Certificados
              </div>
              <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                <Star className="w-4 h-4" />
                Garantia de Qualidade
              </div>
              <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Aprovado por Pais
              </div>
              <div className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Idade Apropriada
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-300 bg-white/5 rounded-lg p-4">
            <p className="font-medium">© 2024 RiHappy. Todos os direitos reservados.</p>
            <p className="mt-2 text-xs">Fazendo a infância mais feliz desde 1956</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ProductCard({ product, onAddToCart }: { product: any; onAddToCart: (quantity: number) => void }) {
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    onAddToCart(quantity)
    setTimeout(() => setIsAdding(false), 1000)
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border border-gray-200 rounded-lg group">
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsLiked(!isLiked)}
          className={`absolute top-3 right-3 z-20 bg-white/90 rounded-full p-2 transition-colors shadow-sm ${
            isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        </Button>

        {product.badge && (
          <Badge className="absolute top-3 right-12 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded animate-pulse">
            -35%
          </Badge>
        )}

        {product.id === 101 && (
          <Badge className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            🔥 MAIS VENDIDO
          </Badge>
        )}
        {product.id === 203 && (
          <Badge className="absolute top-3 left-3 z-10 bg-purple-500 text-white text-xs px-2 py-1 rounded">
            ⭐ PREMIUM
          </Badge>
        )}
        {product.id === 119 && (
          <Badge className="absolute top-3 left-3 z-10 bg-green-500 text-white text-xs px-2 py-1 rounded">
            ✨ NOVIDADE
          </Badge>
        )}

        <div className="aspect-square overflow-hidden bg-white p-4">
          <img
            src={product.image || "/placeholder.svg?height=300&width=300&query=colorful toy"}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 filter group-hover:brightness-110"
          />
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-xs text-gray-500 ml-1">(127)</span>
        </div>

        <h4 className="font-medium text-gray-800 text-sm mb-4 line-clamp-3 leading-relaxed min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
          {product.name}
        </h4>

        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-sm text-gray-500 line-through">R$ {product.originalPrice}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold text-green-600">R$ {product.salePrice}</span>
            <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded">-35%</Badge>
          </div>
          <span className="text-sm text-gray-600">
            ou 2x R$ {(Number.parseFloat(product.salePrice.replace(",", ".")) / 2).toFixed(2).replace(".", ",")} sem
            juros
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center border border-gray-300 rounded">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 p-0 hover:bg-gray-100"
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 p-0 hover:bg-gray-100"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 text-sm rounded transition-all hover:shadow-lg"
          >
            {isAdding ? "adicionando..." : "adicionar"}
          </Button>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Vendido e entregue por <span className="font-medium text-blue-600">RiHappy</span>
          </span>
          <div className="flex items-center gap-1 text-green-600">
            <Truck className="w-3 h-3" />
            <span>Frete Grátis</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getAllProducts() {
  return [
    // Produtos para meninas
    {
      id: 101,
      name: "Boneca Baby Alive - Misturinha Sabor Tropical - E6944 - Hasbro",
      image: "/baby-alive-star-besties.png",
      originalPrice: "299,99",
      salePrice: "89,99",
      rating: 5,
      badge: "🔥 Mais Vendido!",
    },
    {
      id: 102,
      name: "Laptop Infantil - Cute Tech - Hello Kitty - Bilíngue - Candide",
      image: "/placeholder.svg?height=400&width=400",
      originalPrice: "159,99",
      salePrice: "47,99",
      rating: 4,
      badge: null,
    },
    {
      id: 103,
      name: "Boneca Bebê - Baby Alive - Hora da Papinha - Loira - Hasbro",
      image: "/baby-alive-papinha.png",
      originalPrice: "219,99",
      salePrice: "65,99",
      rating: 5,
      badge: null,
    },
    {
      id: 104,
      name: "Boneca Bebê - Sapekinha - Faz Xixi - Vestido Sortido - Milk",
      image: "/placeholder.svg?height=400&width=400",
      originalPrice: "69,99",
      salePrice: "20,99",
      rating: 4,
      badge: null,
    },
    {
      id: 105,
      name: "Boneca Bebê - Baby Alive - Star Besties - Stellar Skylar - Hasbro",
      image: "/placeholder.svg?height=400&width=400",
      originalPrice: "199,99",
      salePrice: "59,99",
      rating: 5,
      badge: null,
    },
    {
      id: 106,
      name: "Laptop de Atividades - Bilíngue - Barbie - Candide",
      image: "/laptop-barbie.png",
      originalPrice: "99,99",
      salePrice: "29,99",
      rating: 4,
      badge: null,
    },
    {
      id: 107,
      name: "Boneca Bebê - Baby Alive - Star Besties - Lovely Luna - Hasbro",
      image: "/baby-alive-lovely-luna.png",
      originalPrice: "199,99",
      salePrice: "59,99",
      rating: 5,
      badge: null,
    },
    {
      id: 108,
      name: "Brinquedo Musical - Gabby's Dollhouse - Orelhas Mágicas",
      image: "/musical-gabbys-dollhouse.png",
      originalPrice: "199,99",
      salePrice: "59,99",
      rating: 4,
      badge: null,
    },
    {
      id: 109,
      name: "Boneca Articulada - Maria Clara - 21 cm - Novabrink",
      image: "/boneca-maria-clara.png",
      originalPrice: "199,99",
      salePrice: "59,99",
      rating: 5,
      badge: null,
    },
    {
      id: 110,
      name: "Boneca - Baby Alive - Foodies Cuties - Modelos Sortido - Hasbro",
      image: "/baby-alive-foodies-cuties.png",
      originalPrice: "149,99",
      salePrice: "44,99",
      rating: 4,
      badge: null,
    },
    {
      id: 111,
      name: "Laptop De Atividades - Bilíngue - Disney - Frozen - Candide",
      image: "/laptop-frozen.png",
      originalPrice: "99,99",
      salePrice: "29,99",
      rating: 5,
      badge: null,
    },
    {
      id: 112,
      name: "Boneca - Miraculous - Lady Bug - Musical - 45 cm - Novabrink",
      image: "/boneca-miraculous-ladybug.png",
      originalPrice: "169,99",
      salePrice: "50,99",
      rating: 5,
      badge: null,
    },
    {
      id: 113,
      name: "Boneca E Acessórios - Baby Alive - Swimmer - Roxo - Hasbro",
      image: "/baby-alive-swimmer.png",
      originalPrice: "99,99",
      salePrice: "29,99",
      rating: 4,
      badge: null,
    },
    {
      id: 114,
      name: "Boneca Bebê - Baby Alive - Sophia Sparkle - Bolhas Mágicas - Hasbro",
      image: "/baby-alive-sophia-sparkle.png",
      originalPrice: "159,99",
      salePrice: "47,99",
      rating: 5,
      badge: null,
    },
    {
      id: 115,
      name: "Boneca Baby Alive - Princesa Bailarina - Morena",
      image: "/baby-alive-princesa-bailarina.png",
      originalPrice: "119,99",
      salePrice: "35,99",
      rating: 4,
      badge: null,
    },
    {
      id: 116,
      name: "Boneca - Gabby's Dollhouse - Gabby Girl - Sunny",
      image: "/placeholder.svg?height=400&width=400",
      originalPrice: "249,99",
      salePrice: "74,99",
      rating: 5,
      badge: null,
    },
    {
      id: 117,
      name: "Boneca Articulada - Disney Moana - 28 cm - Hasbro",
      image: "/boneca-moana-articulada.png",
      originalPrice: "179,99",
      salePrice: "53,99",
      rating: 5,
      badge: null,
    },
    {
      id: 118,
      name: "Boneca Disney - Moana Bebê - 30 cm - Mimo",
      image: "/boneca-disney-moana.png",
      originalPrice: "149,99",
      salePrice: "44,99",
      rating: 4,
      badge: null,
    },
    {
      id: 119,
      name: "Boneca Baby Alive - Pequenos Sonhos - Kit Médico - Hasbro",
      image: "/baby-alive-medica.png",
      originalPrice: "189,99",
      salePrice: "56,99",
      rating: 5,
      badge: "✨ Novidade!",
    },
    // Produtos para meninos
    {
      id: 201,
      name: "Laptop Infantil - Minigame - Bluey - Com Tela Incorporada",
      image: "/laptop-bluey.png",
      originalPrice: "99,99",
      salePrice: "29,99",
      rating: 4,
      badge: "🚀 Lançamento",
    },
    {
      id: 202,
      name: "Boneco - Enaldinho - Youtuber - Novabrink",
      image: "/boneco-enaldinho.png",
      originalPrice: "149,99",
      salePrice: "44,99",
      rating: 4,
      badge: null,
    },
    {
      id: 203,
      name: "LEGO Classic - Caixa Média de Peças Criativas - 10696",
      image: "/lego-classic.png",
      originalPrice: "399,99",
      salePrice: "119,99",
      rating: 5,
      badge: "🔥 Mais Vendido!",
    },
    {
      id: 204,
      name: "Lego - O Carro do Homem-Aranha e Doc Ock - 10789",
      image: "/lego-marvel-homem-aranha.png",
      originalPrice: "99,99",
      salePrice: "29,99",
      rating: 5,
      badge: null,
    },
    {
      id: 205,
      name: "Boneco de Ação - Disney Junior - Marvel - Spidey and His Amazing",
      image: "/boneco-spidey-marvel.png",
      originalPrice: "69,99",
      salePrice: "20,99",
      rating: 4,
      badge: null,
    },
    {
      id: 206,
      name: "Conjunto de Carrinho e Figura - Patrulha Canina O Filme",
      image: "/carrinho-patrulha-canina.png",
      originalPrice: "349,99",
      salePrice: "104,99",
      rating: 5,
      badge: null,
    },
    {
      id: 207,
      name: "Playset De Veículos - Estação De Bombeiro - Escala 1:64 - Cardoso",
      image: "/playset-bombeiro.png",
      originalPrice: "99,99",
      salePrice: "29,99",
      rating: 4,
      badge: null,
    },
    {
      id: 208,
      name: "Conjunto de Carrinho e Figura - Patrulha Canina - Ryder Rescue",
      image: "/carrinho-patrulha-ryder.png",
      originalPrice: "159,99",
      salePrice: "47,99",
      rating: 5,
      badge: null,
    },
    {
      id: 209,
      name: "LEGO - Marvel - Super Heroes - Confronto Hulk Contra",
      image: "/lego-marvel-super-heroes.png",
      originalPrice: "199,99",
      salePrice: "59,99",
      rating: 5,
      badge: null,
    },
    {
      id: 210,
      name: "Boneco de Vinil - José Totoy - Novabrink",
      image: "/placeholder.svg?height=400&width=400",
      originalPrice: "149,99",
      salePrice: "44,99",
      rating: 4,
      badge: null,
    },
    {
      id: 211,
      name: "Boneco - Maria Clara E Jp - Jp - Frases - Azul - Novabrink",
      image: "/boneco-maria-clara-jp.png",
      originalPrice: "239,99",
      salePrice: "71,99",
      rating: 4,
      badge: null,
    },
    {
      id: 212,
      name: "Boneco Articulado - Marvel - Spidey And His Amazing Friends",
      image: "/placeholder.svg?height=400&width=400",
      originalPrice: "79,99",
      salePrice: "23,99",
      rating: 5,
      badge: null,
    },
    // Produtos educativos
    {
      id: 301,
      name: "Tapete Bilíngue com Apagador para Colorir - Play-Doh - Fun",
      image: "/tapete-play-doh.png",
      originalPrice: "99,99",
      salePrice: "29,99",
      rating: 5,
      badge: null,
    },
    {
      id: 302,
      name: "Conjunto De Pintura - Patrulha Canina - Skye - Elka",
      image: "/pintura-patrulha-canina-skye.png",
      originalPrice: "79,99",
      salePrice: "23,99",
      rating: 4,
      badge: null,
    },
    {
      id: 303,
      name: "Conjunto de Pintura - Chase - Patrulha Canina - Elka",
      image: "/pintura-patrulha-canina-chase.png",
      originalPrice: "79,99",
      salePrice: "23,99",
      rating: 4,
      badge: null,
    },
    {
      id: 304,
      name: "Conjunto - Aquabeads - Beginners Carry Case - Star Beads - Epoch",
      image: "/aquabeads-beginners.png",
      originalPrice: "219,99",
      salePrice: "65,99",
      rating: 5,
      badge: null,
    },
    {
      id: 305,
      name: "Kit De Atividades - Livro - Fazendo Arte - Stitch - Boneco De Feltro",
      image: "/kit-stitch.png",
      originalPrice: "99,99",
      salePrice: "29,99",
      rating: 4,
      badge: null,
    },
    {
      id: 306,
      name: "Conjunto de Pintura E Acessórios - Patrulha Canina - 04 Telas - Nig",
      image: "/placeholder.svg?height=400&width=400",
      originalPrice: "109,99",
      salePrice: "32,99",
      rating: 4,
      badge: null,
    },
    {
      id: 307,
      name: "Boneca Bebê com Acessórios - Baby Alive - Bella - Hora da",
      image: "/placeholder.svg?height=400&width=400",
      originalPrice: "399,99",
      salePrice: "119,99",
      rating: 5,
      badge: null,
    },
    {
      id: 308,
      name: "Conjunto de Carrinho e Figura - Patrulha Canina - Caminhão de",
      image: "/placeholder.svg?height=400&width=400",
      originalPrice: "159,99",
      salePrice: "47,99",
      rating: 5,
      badge: null,
    },
  ]
}

function getFilteredProducts(sortBy: string, priceRange: string) {
  let products = getAllProducts()

  // Filter by price range
  if (priceRange !== "all") {
    products = products.filter((product) => {
      const price = Number.parseFloat(product.salePrice.replace(",", "."))
      switch (priceRange) {
        case "0-50":
          return price <= 50
        case "50-100":
          return price > 50 && price <= 100
        case "100-200":
          return price > 100 && price <= 200
        case "200+":
          return price > 200
        default:
          return true
      }
    })
  }

  // Sort products
  switch (sortBy) {
    case "price-low":
      products.sort(
        (a, b) => Number.parseFloat(a.salePrice.replace(",", ".")) - Number.parseFloat(b.salePrice.replace(",", ".")),
      )
      break
    case "price-high":
      products.sort(
        (a, b) => Number.parseFloat(b.salePrice.replace(",", ".")) - Number.parseFloat(a.salePrice.replace(",", ".")),
      )
      break
    case "rating":
      products.sort((a, b) => b.rating - a.rating)
      break
    case "name":
      products.sort((a, b) => a.name.localeCompare(b.name))
      break
    default:
      // Keep original order for relevance
      break
  }

  return products
}
