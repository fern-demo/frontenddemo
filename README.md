[Front End Demo](https://v0-fern-disney-webapp.vercel.app/)

## 🎯 Purpose 

This project serves as a **demo showcase** for how easy it is to integrate and use a Fern-generated TypeScript SDK in a modern React application. It highlights the developer experience benefits of Fern's SDK generation:

- **Type Safety**: Full TypeScript support out of the box
- **Simple API**: Clean, intuitive method calls
- **Zero Configuration**: No complex setup required
- **Excellent DX**: IntelliSense and autocomplete support

## 📦 Fern SDK Integration

### Installation

The Fern-generated SDK is installed as a standard npm package:

\`\`\`bash
npm install disney-public-sdk
\`\`\`

### Usage in the Application

The SDK integration is remarkably simple and can be found in \`app/page.tsx\`:

#### 1. Import the Client

\`\`\`typescript
import { DisneyOpensourceClient } from "disney-public-sdk"
\`\`\`

#### 2. Initialize the Client

\`\`\`typescript
const client = new DisneyOpensourceClient()
\`\`\`

#### 3. Make API Calls

\`\`\`typescript
const shuffleAndDraw = async () => {
  try {
    // Fetch all characters from the Disney API
    const allCharacters = await client.getAllCharacters()
    
    // Select a random character
    const randomIndex = Math.floor(Math.random() * allCharacters.data.length)
    const randomCharacter = allCharacters.data[randomIndex]
    
    setCharacter(randomCharacter)
  } catch (err) {
    console.error("Error fetching character:", err)
    setError("Failed to fetch character. Please try again.")
  }
}
\`\`\`

### Key SDK Benefits Demonstrated

1. **No Configuration Required**: The client works immediately without any setup
2. **Type Safety**: Full TypeScript interfaces for all API responses
3. **Error Handling**: Built-in error handling with proper TypeScript types
4. **IntelliSense Support**: Full autocomplete for methods and response properties
5. **Promise-Based**: Modern async/await support

### API Response Structure

The SDK returns well-typed character objects with the following structure:

\`\`\`typescript
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
\`\`\`

## 🔍 SDK Integration Points

The Fern SDK is used in the following locations:

### Primary Integration: \`app/page.tsx\`

- **Line 7**: SDK import statement
- **Line 25**: Client initialization  
- **Line 27-45**: Main API call in \`shuffleAndDraw\` function
- **Line 32**: \`client.getAllCharacters()\` method call

### Key Features Demonstrated

1. **Simple Import**: Single import statement for the entire SDK
2. **Zero Config**: No environment variables or configuration needed
3. **Type Safety**: Full TypeScript support with proper interfaces
4. **Error Handling**: Graceful error handling with try/catch
5. **Async Operations**: Modern Promise-based API calls

## 🌟 Why This Demonstrates Fern's Value

This project showcases several key advantages of Fern-generated SDKs:

1. **Developer Experience**: From zero to API calls in 3 lines of code
2. **Type Safety**: No manual type definitions needed
3. **Consistency**: Standardized patterns across all API methods
4. **Maintainability**: SDK updates automatically when API changes
5. **Documentation**: Self-documenting code through TypeScript types
6. **Simplicity**: Complex API interactions made simple

## 📚 Learn More

- [Fern Documentation](https://buildwithfern.com/learn)

**Built with ❤️ to showcase the power of Fern-generated TypeScript SDKs**
