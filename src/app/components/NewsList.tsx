'use client'

import { useState, useEffect } from 'react'
import NewsCard from './NewsCard'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/app/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface NewsItem {
  _id: string
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  source: {
    id: string | null
    name: string
  }
}

export default function NewsList() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [category, setCategory] = useState('all')
  const [country, setCountry] = useState('all')
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)

  const [manualCategory, setManualCategory] = useState('all')
  const [manualCountry, setManualCountry] = useState('all')
  const [manualLoading, setManualLoading] = useState(false)
  const [manualFetchCount, setManualFetchCount] = useState(0)

  useEffect(() => {
    fetchManualFetchCount()
  }, [])

  const fetchManualFetchCount = async () => {
    try {
      const res = await fetch('/api/manual-fetch-count')
      if (res.ok) {
        const data = await res.json()
        setManualFetchCount(data.count)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch manual fetch count.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching manual fetch count:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching manual fetch count.",
        variant: "destructive",
      })
    }
  }

  const fetchNews = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category !== 'all') params.append('category', category)
    if (country !== 'all') params.append('country', country)
    if (date) params.append('date', date.toISOString().split('T')[0])

    try {
      const response = await fetch(`/api/news?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch news')
      const data = await response.json()
      setNews(data)
    } catch (error) {
      console.error('Error fetching news:', error)
      toast({
        title: "Error",
        description: "Failed to fetch news. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const manualFetch = async () => {
    if (manualFetchCount >= 10) {
      toast({
        title: "Limit Reached",
        description: "You've reached the maximum number of manual fetches.",
      })
      return
    }

    setManualLoading(true)
    try {
      const body = {
        category: manualCategory !== 'all' ? manualCategory : undefined,
        country: manualCountry !== 'all' ? manualCountry : undefined,
      }

      const response = await fetch('/api/manual-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) throw new Error('Failed to perform manual fetch')

      await fetchManualFetchCount()
      await fetchNews()
      toast({
        title: "Success",
        description: "Manual fetch completed successfully.",
      })
    } catch (error) {
      console.error('Error during manual fetch:', error)
      toast({
        title: "Error",
        description: "Failed to perform manual fetch. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setManualLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="science">Science</SelectItem>
          </SelectContent>
        </Select>

        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            <SelectItem value="in">India</SelectItem>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="gb">United Kingdom</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-[180px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button onClick={fetchNews} className="w-full md:w-auto">
          Get News
        </Button>
      </div>

      <div className="bg-background border border-border p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Manual Fetch</h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Select value={manualCategory} onValueChange={setManualCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="science">Science</SelectItem>
            </SelectContent>
          </Select>

          <Select value={manualCountry} onValueChange={setManualCountry}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              <SelectItem value="in">India</SelectItem>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="gb">United Kingdom</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={manualFetch} 
            disabled={manualFetchCount >= 10 || manualLoading} 
            className="w-full md:w-auto"
          >
            {manualLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
            Manual Fetch
          </Button>
        </div>

        <div className="mt-2">
          <span className={cn("text-sm", manualFetchCount >= 10 ? "text-destructive" : "text-muted-foreground")}>
            Manual Fetches: {manualFetchCount}/10
          </span>
        </div>
      </div>

      {loading || manualLoading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin text-primary" size={24} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item: NewsItem) => (
            <NewsCard key={item._id} {...item} />
          ))}
        </div>
      )}
    </div>
  )
}