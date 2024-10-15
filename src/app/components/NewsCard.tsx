import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card"
import { ExternalLink } from "lucide-react"
import { useState } from "react"

interface NewsCardProps {
  title: string | null
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  source: {
    id: string | null
    name: string
  }
}

export default function NewsCard({
  title,
  description,
  url,
  urlToImage,
  publishedAt,
  source,
}: NewsCardProps) {
  const [imageError, setImageError] = useState(false)

  const formatTimeAgo = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + " years ago"
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + " months ago"
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + " days ago"
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + " hours ago"
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + " minutes ago"
    return Math.floor(seconds) + " seconds ago"
  }

  const truncate = (str: string | null | undefined, n: number): string => {
    if (!str) return ''
    return str.length > n ? str.substr(0, n - 1) + "..." : str
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <a href={url} target="_blank" rel="noopener noreferrer" className="block h-full">
        <div className="relative h-48 overflow-hidden">
          {!imageError && urlToImage ? (
            <img
              src={urlToImage}
              alt={title || "News Image"}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              No image available
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <p className="text-white text-sm font-medium">{source.name || "Unknown Source"}</p>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
            {truncate(title, 60)}
          </CardTitle>
          <CardDescription>
            {formatTimeAgo(publishedAt)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 line-clamp-3 mb-4">{truncate(description, 120)}</p>
          <div className="flex items-center text-primary hover:underline">
            <span className="mr-2">Read more</span>
            <ExternalLink size={16} />
          </div>
        </CardContent>
      </a>
    </Card>
  )
}
