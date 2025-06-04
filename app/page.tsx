"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shuffle, Sparkles, Film, Tv, Gamepad2 } from "lucide-react"
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

export default function DisneyCardDeck() {
  const [character, setCharacter] = useState<DisneyCharacter | null>(null)
  const [isShuffling, setIsShuffling] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const client = new DisneyOpensourceClient()

  const shuffleAndDraw = async () => {
    setIsShuffling(true)
    setIsLoading(true)
    setError(null)

    try {
      // First get all characters to know the total count
      const allCharacters = await client.getAllCharacters()

      if (!allCharacters.data || allCharacters.data.length === 0) {
        throw new Error("No characters found")
      }

      // Generate random index
      const randomIndex = Math.floor(Math.random() * allCharacters.data.length)
      const randomCharacter = allCharacters.data[randomIndex]

      // Add shuffle delay for animation effect
      setTimeout(() => {
        setCharacter(randomCharacter)
        setIsShuffling(false)
        setIsLoading(false)
      }, 1500)
    } catch (err) {
      console.error("Error fetching character:", err)
      setError("Failed to fetch character. Please try again.")
      setIsShuffling(false)
      setIsLoading(false)
    }
  }

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
            disney-public-sdk
          </Badge>
        </div>

        {/* Card Deck Area */}
        <div className="flex flex-col items-center gap-8">
          {/* Deck of Cards Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl transform rotate-3 opacity-30"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl transform rotate-1 opacity-40"></div>
            <div
              className={`relative w-64 h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                isShuffling ? "animate-pulse scale-110" : ""
              }`}
              onClick={shuffleAndDraw}
            >
              <div className="absolute inset-4 border-2 border-white/30 rounded-lg flex flex-col items-center justify-center text-white">
                <Shuffle className={`w-16 h-16 mb-4 ${isShuffling ? "animate-spin" : ""}`} />
                <p className="text-xl font-bold text-center">{isShuffling ? "Shuffling..." : "Click to Draw"}</p>
                <p className="text-sm opacity-75 text-center mt-2">Disney Character Card</p>
              </div>
            </div>
          </div>

          {/* Shuffle Button */}
          <Button
            onClick={shuffleAndDraw}
            disabled={isLoading}
            size="lg"
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-8 py-3 text-lg"
          >
            <Shuffle className="w-5 h-5 mr-2" />
            {isLoading ? "Drawing..." : "Shuffle & Draw"}
          </Button>

          {/* Error Display */}
          {error && (
            <Card className="w-full max-w-md bg-red-50 border-red-200">
              <CardContent className="p-4">
                <p className="text-red-600 text-center">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Character Card */}
          {character && !isShuffling && (
            <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-3xl font-bold text-gray-800 mb-2">{character.name}</CardTitle>
                {character.imageUrl && (
                  <div className="flex justify-center">
                    <img
                      src={character.imageUrl || "/placeholder.svg"}
                      alt={character.name}
                      className="w-48 h-48 object-cover rounded-full border-4 border-yellow-400 shadow-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Films */}
                {character.films && character.films.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-2">
                      <Film className="w-5 h-5 text-blue-600" />
                      Films
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {character.films.slice(0, 5).map((film, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                          {film}
                        </Badge>
                      ))}
                      {character.films.length > 5 && (
                        <Badge variant="outline">+{character.films.length - 5} more</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* TV Shows */}
                {character.tvShows && character.tvShows.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-2">
                      <Tv className="w-5 h-5 text-green-600" />
                      TV Shows
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {character.tvShows.slice(0, 5).map((show, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                          {show}
                        </Badge>
                      ))}
                      {character.tvShows.length > 5 && (
                        <Badge variant="outline">+{character.tvShows.length - 5} more</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Video Games */}
                {character.videoGames && character.videoGames.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-2">
                      <Gamepad2 className="w-5 h-5 text-purple-600" />
                      Video Games
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {character.videoGames.slice(0, 5).map((game, index) => (
                        <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                          {game}
                        </Badge>
                      ))}
                      {character.videoGames.length > 5 && (
                        <Badge variant="outline">+{character.videoGames.length - 5} more</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Park Attractions */}
                {character.parkAttractions && character.parkAttractions.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-2">
                      <Sparkles className="w-5 h-5 text-yellow-600" />
                      Park Attractions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {character.parkAttractions.slice(0, 3).map((attraction, index) => (
                        <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-800">
                          {attraction}
                        </Badge>
                      ))}
                      {character.parkAttractions.length > 3 && (
                        <Badge variant="outline">+{character.parkAttractions.length - 3} more</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Allies & Enemies */}
                <div className="grid md:grid-cols-2 gap-4">
                  {character.allies && character.allies.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-green-700 mb-2">Allies</h3>
                      <div className="space-y-1">
                        {character.allies.slice(0, 3).map((ally, index) => (
                          <p key={index} className="text-sm text-gray-600">
                            • {ally}
                          </p>
                        ))}
                        {character.allies.length > 3 && (
                          <p className="text-sm text-gray-500">+{character.allies.length - 3} more</p>
                        )}
                      </div>
                    </div>
                  )}

                  {character.enemies && character.enemies.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-red-700 mb-2">Enemies</h3>
                      <div className="space-y-1">
                        {character.enemies.slice(0, 3).map((enemy, index) => (
                          <p key={index} className="text-sm text-gray-600">
                            • {enemy}
                          </p>
                        ))}
                        {character.enemies.length > 3 && (
                          <p className="text-sm text-gray-500">+{character.enemies.length - 3} more</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Source Link */}
                {character.sourceUrl && (
                  <div className="pt-4 border-t">
                    <a
                      href={character.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Learn more about {character.name} →
                    </a>
                  </div>
                )}
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
