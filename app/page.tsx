"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shuffle, Sparkles, Film, Tv, Gamepad2, RotateCcw, Heart, X, Info, Users, Swords } from "lucide-react"
import { DisneyOpensourceClient } from "disney-public-sdk"

interface DisneyCharacter {
  _id: number
  name: string
  imageUrl?: string
  films?: string[]
  shortFilms?: string[]
  tvShows?: string[]
  videoGames?: string[]
  parkAttractions?: string[]
  allies?: string[]
  enemies?: string[]
  sourceUrl?: string
}

interface CardState {
  character: DisneyCharacter
  id: string
  isFlipped: boolean
  zIndex: number
  rotation: number
  offsetX: number
  offsetY: number
}

export default function DisneyCardDeck() {
  const [cardStack, setCardStack] = useState<CardState[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [currentDrag, setCurrentDrag] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const client = new DisneyOpensourceClient()

  // Pre-load multiple characters for smooth interactions
  const loadCharacters = async (count = 5) => {
    setIsLoading(true)
    setError(null)

    try {
      const allCharacters = await client.getAllCharacters()

      if (!allCharacters.data || allCharacters.data.length === 0) {
        throw new Error("No characters found")
      }

      const newCards: CardState[] = []
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * allCharacters.data.length)
        const character = allCharacters.data[randomIndex]

        newCards.push({
          character,
          id: `card-${Date.now()}-${i}`,
          isFlipped: false,
          zIndex: count - i,
          rotation: (Math.random() - 0.5) * 6, // Random rotation between -3 and 3 degrees
          offsetX: (Math.random() - 0.5) * 8, // Random offset
          offsetY: (Math.random() - 0.5) * 8,
        })
      }

      setCardStack(newCards)
      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching characters:", err)
      setError("Failed to fetch characters. Please try again.")
      setIsLoading(false)
    }
  }

  // Initialize with characters
  useEffect(() => {
    loadCharacters()
  }, [])

  const flipCard = (cardId: string) => {
    setCardStack((prev) => prev.map((card) => (card.id === cardId ? { ...card, isFlipped: !card.isFlipped } : card)))
  }

  const swipeCard = (direction: "left" | "right") => {
    if (cardStack.length === 0) return

    const topCard = cardStack[cardStack.length - 1]

    // Animate card out
    setCardStack((prev) =>
      prev.map((card) =>
        card.id === topCard.id
          ? {
              ...card,
              offsetX: direction === "left" ? -400 : 400,
              rotation: direction === "left" ? -30 : 30,
            }
          : card,
      ),
    )

    // Remove card after animation and add new one
    setTimeout(() => {
      setCardStack((prev) => {
        const remaining = prev.filter((card) => card.id !== topCard.id)

        // If we're running low on cards, load more
        if (remaining.length <= 2) {
          loadCharacters(3)
          return remaining
        }

        return remaining
      })
    }, 300)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (cardStack.length === 0) return
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setCurrentDrag({ x: 0, y: 0 })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || cardStack.length === 0) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    setCurrentDrag({ x: deltaX, y: deltaY })
  }

  const handleMouseUp = () => {
    if (!isDragging || cardStack.length === 0) return

    setIsDragging(false)

    // If dragged far enough, swipe the card
    if (Math.abs(currentDrag.x) > 100) {
      swipeCard(currentDrag.x > 0 ? "right" : "left")
    }

    setCurrentDrag({ x: 0, y: 0 })
  }

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (cardStack.length === 0) return
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({ x: touch.clientX, y: touch.clientY })
    setCurrentDrag({ x: 0, y: 0 })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || cardStack.length === 0) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - dragStart.x
    const deltaY = touch.clientY - dragStart.y
    setCurrentDrag({ x: deltaX, y: deltaY })
  }

  const handleTouchEnd = () => {
    handleMouseUp()
  }

  const topCard = cardStack[cardStack.length - 1]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="text-yellow-400" />
            Disney Character Deck
            <Sparkles className="text-yellow-400" />
          </h1>
          <p className="text-blue-200 text-lg">Powered by Fern-generated TypeScript SDK</p>
          <Badge variant="secondary" className="mt-2">
            disney-public-sdk • Interactive Cards
          </Badge>
        </div>

        {/* Instructions */}
        <div className="text-center mb-6">
          <p className="text-blue-200 text-sm">💡 Click to flip • Drag to swipe • ❤️ Like • ✕ Pass</p>
        </div>

        {/* Card Stack Area */}
        <div className="flex flex-col items-center gap-8">
          {/* Card Stack */}
          <div className="relative w-80 h-96 perspective-1000">
            {cardStack.length === 0 && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={() => loadCharacters()}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  <Shuffle className="w-5 h-5 mr-2" />
                  Draw Cards
                </Button>
              </div>
            )}

            {cardStack.map((cardState, index) => {
              const isTopCard = index === cardStack.length - 1
              const dragTransform =
                isTopCard && isDragging
                  ? `translate(${currentDrag.x}px, ${currentDrag.y}px) rotate(${currentDrag.x * 0.1}deg)`
                  : ""

              return (
                <div
                  key={cardState.id}
                  ref={isTopCard ? cardRef : null}
                  className={`absolute inset-0 transition-all duration-300 cursor-pointer ${
                    isTopCard ? "hover:scale-105" : ""
                  }`}
                  style={{
                    zIndex: cardState.zIndex,
                    transform: `
                      translate(${cardState.offsetX + (isTopCard ? currentDrag.x : 0)}px, 
                                ${cardState.offsetY + (isTopCard ? currentDrag.y : 0)}px) 
                      rotate(${cardState.rotation + (isTopCard && isDragging ? currentDrag.x * 0.1 : 0)}deg)
                      scale(${1 - (cardStack.length - 1 - index) * 0.05})
                    `,
                    transformStyle: "preserve-3d",
                  }}
                  onMouseDown={isTopCard ? handleMouseDown : undefined}
                  onMouseMove={isTopCard ? handleMouseMove : undefined}
                  onMouseUp={isTopCard ? handleMouseUp : undefined}
                  onMouseLeave={isTopCard ? handleMouseUp : undefined}
                  onTouchStart={isTopCard ? handleTouchStart : undefined}
                  onTouchMove={isTopCard ? handleTouchMove : undefined}
                  onTouchEnd={isTopCard ? handleTouchEnd : undefined}
                  onClick={() => !isDragging && flipCard(cardState.id)}
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                      cardState.isFlipped ? "rotate-y-180" : ""
                    }`}
                  >
                    {/* Front of Card */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                      <Card className="w-full h-full bg-gradient-to-br from-white to-blue-50 shadow-2xl border-2 border-blue-200">
                        <CardHeader className="text-center pb-4">
                          <CardTitle className="text-2xl font-bold text-gray-800 mb-4">
                            {cardState.character.name}
                          </CardTitle>
                          {cardState.character.imageUrl && (
                            <div className="flex justify-center">
                              <img
                                src={cardState.character.imageUrl || "/placeholder.svg"}
                                alt={cardState.character.name}
                                className="w-32 h-32 object-cover rounded-full border-4 border-yellow-400 shadow-lg"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg?height=128&width=128"
                                }}
                              />
                            </div>
                          )}
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Quick Stats */}
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-blue-100 rounded-lg p-3">
                              <Film className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                              <p className="text-sm font-semibold text-blue-800">
                                {cardState.character.films?.length || 0} Films
                              </p>
                            </div>
                            <div className="bg-green-100 rounded-lg p-3">
                              <Tv className="w-6 h-6 mx-auto mb-1 text-green-600" />
                              <p className="text-sm font-semibold text-green-800">
                                {cardState.character.tvShows?.length || 0} TV Shows
                              </p>
                            </div>
                          </div>

                          {/* Featured Films */}
                          {cardState.character.films && cardState.character.films.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-700 mb-2">Featured In:</h4>
                              <div className="flex flex-wrap gap-1">
                                {cardState.character.films.slice(0, 3).map((film, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {film}
                                  </Badge>
                                ))}
                                {cardState.character.films.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{cardState.character.films.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="text-center pt-4">
                            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                              <Info className="w-3 h-3" />
                              Click to flip for details
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Back of Card */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                      <Card className="w-full h-full bg-gradient-to-br from-purple-50 to-pink-50 shadow-2xl border-2 border-purple-200">
                        <CardHeader className="text-center pb-2">
                          <CardTitle className="text-xl font-bold text-gray-800">{cardState.character.name}</CardTitle>
                          <p className="text-sm text-gray-600">Character Details</p>
                        </CardHeader>

                        <CardContent className="space-y-3 text-sm">
                          {/* Video Games */}
                          {cardState.character.videoGames && cardState.character.videoGames.length > 0 && (
                            <div>
                              <h4 className="flex items-center gap-1 font-semibold text-purple-700 mb-1">
                                <Gamepad2 className="w-4 h-4" />
                                Games ({cardState.character.videoGames.length})
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {cardState.character.videoGames.slice(0, 2).map((game, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs bg-purple-100">
                                    {game}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Park Attractions */}
                          {cardState.character.parkAttractions && cardState.character.parkAttractions.length > 0 && (
                            <div>
                              <h4 className="flex items-center gap-1 font-semibold text-yellow-700 mb-1">
                                <Sparkles className="w-4 h-4" />
                                Attractions ({cardState.character.parkAttractions.length})
                              </h4>
                              <div className="space-y-1">
                                {cardState.character.parkAttractions.slice(0, 2).map((attraction, idx) => (
                                  <p key={idx} className="text-xs text-gray-600">
                                    • {attraction}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Allies */}
                          {cardState.character.allies && cardState.character.allies.length > 0 && (
                            <div>
                              <h4 className="flex items-center gap-1 font-semibold text-green-700 mb-1">
                                <Users className="w-4 h-4" />
                                Allies ({cardState.character.allies.length})
                              </h4>
                              <div className="space-y-1">
                                {cardState.character.allies.slice(0, 2).map((ally, idx) => (
                                  <p key={idx} className="text-xs text-gray-600">
                                    • {ally}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Enemies */}
                          {cardState.character.enemies && cardState.character.enemies.length > 0 && (
                            <div>
                              <h4 className="flex items-center gap-1 font-semibold text-red-700 mb-1">
                                <Swords className="w-4 h-4" />
                                Enemies ({cardState.character.enemies.length})
                              </h4>
                              <div className="space-y-1">
                                {cardState.character.enemies.slice(0, 2).map((enemy, idx) => (
                                  <p key={idx} className="text-xs text-gray-600">
                                    • {enemy}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="text-center pt-2">
                            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                              <RotateCcw className="w-3 h-3" />
                              Click to flip back
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-2xl animate-pulse">
                  <div className="absolute inset-4 border-2 border-white/30 rounded-lg flex flex-col items-center justify-center text-white">
                    <Shuffle className="w-16 h-16 mb-4 animate-spin" />
                    <p className="text-xl font-bold">Loading Cards...</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {topCard && !isLoading && (
            <div className="flex gap-4">
              <Button
                onClick={() => swipeCard("left")}
                size="lg"
                variant="outline"
                className="bg-red-50 border-red-200 hover:bg-red-100 text-red-700"
              >
                <X className="w-5 h-5 mr-2" />
                Pass
              </Button>

              <Button
                onClick={() => flipCard(topCard.id)}
                size="lg"
                variant="outline"
                className="bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Flip
              </Button>

              <Button
                onClick={() => swipeCard("right")}
                size="lg"
                variant="outline"
                className="bg-green-50 border-green-200 hover:bg-green-100 text-green-700"
              >
                <Heart className="w-5 h-5 mr-2" />
                Like
              </Button>
            </div>
          )}

          {/* Card Counter */}
          {cardStack.length > 0 && (
            <div className="text-center">
              <Badge variant="secondary" className="text-sm">
                {cardStack.length} cards remaining
              </Badge>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Card className="w-full max-w-md bg-red-50 border-red-200">
              <CardContent className="p-4">
                <p className="text-red-600 text-center">{error}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-blue-200">
          <p className="text-sm">Built with ❤️ using Fern-generated SDK • Data from DisneyAPI.dev</p>
        </div>
      </div>
    </div>
  )
}
