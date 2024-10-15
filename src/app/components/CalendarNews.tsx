/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar, User, Skull, Search, ChevronDown, ChevronUp, Share2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover"
import { Calendar as CalendarPicker } from "@/app/components/ui/calendar"
import { ErrorBoundary } from 'react-error-boundary'
import { Skeleton } from "@/components/ui/skeleton"

interface NewsArticle {
  year: string
  text: string
  pages: Array<{ title: string; extract: string }>
}

type Category = 'events' | 'births' | 'deaths'

const ITEMS_PER_PAGE = 5

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="text-destructive py-4 bg-destructive/10 rounded-md px-4" role="alert">
      <p>Something went wrong:</p>
      <pre className="text-sm">{error.message}</pre>
      <Button onClick={resetErrorBoundary} className="mt-4">Try again</Button>
    </div>
  )
}

function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function CalendarNews() {
  const [calendarNews, setCalendarNews] = useState<{ [key in Category]: NewsArticle[] }>({
    events: [],
    births: [],
    deaths: [],
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category>('events')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchNews(selectedDate)
  }, [selectedDate])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchTerm])

  const fetchNews = async (date: Date) => {
    setLoading(true)
    try {
      const formattedDate = format(date, 'MM/dd')
      const res = await fetch(`/api/calendar-news?date=${formattedDate}`)
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to fetch calendar news')
      }
      const data = await res.json()
      setCalendarNews({
        events: data.events || [],
        births: data.births || [],
        deaths: data.deaths || [],
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredNews = calendarNews[selectedCategory].filter((event) =>
    event.text.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE)
  const paginatedNews = filteredNews.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvents((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(eventId)) {
        newSet.delete(eventId)
      } else {
        newSet.add(eventId)
      }
      return newSet
    })
  }

  const shareEvent = async (event: NewsArticle) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'On This Day',
          text: `${event.year}: ${event.text}`,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      alert('Web Share API is not supported in your browser')
    }
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => fetchNews(selectedDate)}>
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader className="text-primary">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold">On This Day</CardTitle>
              <CardDescription className="text-primary">{format(selectedDate, 'MMMM d, yyyy')}</CardDescription>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="dark:bg-white dark:text-zinc-900 text-primary">
                  <Calendar className="mr-2 h-4 w-4" /> Pick a date
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={selectedCategory} onValueChange={(value) => handleCategoryChange(value as Category)} className="mb-6">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="events" className="flex items-center justify-center">
                <Calendar className="w-4 h-4 mr-2" />
                Events
              </TabsTrigger>
              <TabsTrigger value="births" className="flex items-center justify-center">
                <User className="w-4 h-4 mr-2" />
                Births
              </TabsTrigger>
              <TabsTrigger value="deaths" className="flex items-center justify-center">
                <Skull className="w-4 h-4 mr-2" />
                Deaths
              </TabsTrigger>
            </TabsList>

            {['events', 'births', 'deaths'].map((category) => (
              <TabsContent key={category} value={category}>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-600" />
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-2 border-2 border-zinc-600 rounded-md focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    />
                  </div>

                  {loading ? (
                    <SkeletonLoader />
                  ) : error ? (
                    <p className="text-destructive py-4 bg-destructive/10 rounded-md px-4">Error: {error}</p>
                  ) : (
                    <>
                      {filteredNews.length > 0 ? (
                        <ul className="space-y-3">
                          {paginatedNews.map((event: NewsArticle, index: number) => {
                            const eventId = `${event.year}-${index}`
                            const isExpanded = expandedEvents.has(eventId)
                            return (
                              <li key={eventId} className="bg-muted p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="font-semibold text-primary">{event.year}: </span>
                                    {event.text}
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleEventExpansion(eventId)}
                                      aria-expanded={isExpanded}
                                      aria-controls={`event-details-${eventId}`}
                                    >
                                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                      <span className="sr-only">{isExpanded ? 'Hide' : 'Show'} details</span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => shareEvent(event)}
                                      aria-label="Share this event"
                                    >
                                      <Share2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                {isExpanded && (
                                  <div id={`event-details-${eventId}`} className="mt-2 text-sm text-muted-foreground">
                                    {event.pages.map((page, pageIndex) => (
                                      <p key={pageIndex} className="mt-1">
                                        <strong>{page.title}:</strong> {page.extract}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground py-4 text-center bg-muted rounded-md">No historical events found for your search.</p>
                      )}

                      {filteredNews.length > ITEMS_PER_PAGE && (
                        <div className="flex justify-between items-center mt-6">
                          <Button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            variant="outline"
                            className="px-4 py-2"
                          >
                            Previous
                          </Button>
                          <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                            Page {currentPage} of {totalPages}
                          </span>
                          <Button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            variant="outline"
                            className="px-4 py-2"
                          >
                            Next
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}