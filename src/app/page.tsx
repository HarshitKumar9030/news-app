'use client'

import { useState } from "react"
import { Suspense } from "react"
import NewsList from "./components/NewsList"
import ThemeToggle from "@/components/ThemeToggle"
import CalendarNews from "@/app/components/CalendarNews"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowUp, Calendar, Newspaper } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Footer from "@/components/Footer"

export default function Home() {
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScrollToTop(true)
    } else {
      setShowScrollToTop(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">Current Affairs</h1>
            <div className="text-sm text-muted-foreground">Made by Harshit ~</div>
          </div>
          <ThemeToggle />
        </div>
        <div className="w-full h-[0.1rem] bg-secondary"></div>
      </header>

      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Stay Informed, Stay Ahead</h2>
          <p className="text-xl">Your daily dose of current affairs and historical insights</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">
              <Calendar className="mr-2 h-4 w-4" />
              On This Day
            </TabsTrigger>
            <TabsTrigger value="news">
              <Newspaper className="mr-2 h-4 w-4" />
              Latest News
            </TabsTrigger>
          </TabsList>
          <TabsContent value="calendar">
            <Suspense fallback={<CalendarNewsSkeleton />}>
              <CalendarNews />
            </Suspense>
          </TabsContent>
          <TabsContent value="news">
            <Suspense fallback={<NewsListSkeleton />}>
              <NewsList />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />

      {showScrollToTop && (
        <Button
          className="fixed bottom-4 right-4 rounded-full p-2"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}
    </main>
  )
}

function CalendarNewsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  )
}

function NewsListSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    </div>
  )
}