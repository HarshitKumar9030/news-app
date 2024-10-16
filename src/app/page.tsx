'use client'

import { useState, useEffect } from "react"
import { Suspense } from "react"
import Head from 'next/head'
import NewsList from "./components/NewsList"
import ThemeToggle from "@/components/ThemeToggle"
import CalendarNews from "@/app/components/CalendarNews"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowUp, Calendar, Newspaper } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Footer from "@/components/Footer"
import { Input } from "@/components/ui/input"

export default function Home() {
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  // const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   // Implement search functionality here
  //   console.log("Searching for:", searchTerm)
  // }

  return (
    <>
      <Head>
        <title>Current Affairs | Stay Informed, Stay Ahead</title>
        <meta name="description" content="Get your daily dose of current affairs and historical insights. Stay informed with the latest news and 'On This Day' events." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Current Affairs",
            "description": "Your daily dose of current affairs and historical insights",
            "url": "https://news.leoncyriac.me"
          })}
        </script>
      </Head>
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
            <p className="text-xl mb-8">Your daily dose of current affairs and historical insights</p>
            {/* <form onSubmit={handleSearch} className="flex justify-center">
              <Input
                type="search"
                placeholder="Search news..."
                className="max-w-sm mr-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form> */}
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

        <section className="bg-secondary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8">Subscribe to our newsletter for daily current affairs updates</p>
            <form className="flex justify-center">
              <Input
                type="email"
                placeholder="Enter your email"
                className="max-w-sm mr-2"
                required
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </section>

        <Footer />

        <div className="fixed bottom-4 right-4 space-y-2">
          {showScrollToTop && (
            <Button
              className="rounded-full p-2 transition-opacity duration-300 ease-in-out"
              onClick={scrollToTop}
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-6 w-6" />
            </Button>
          )}
          <div className="space-x-2">
            <Button
              className="rounded-full p-2"
              onClick={() => window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href), '_blank')}
              aria-label="Share on Twitter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </Button>
            <Button
              className="rounded-full p-2"
              onClick={() => window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), '_blank')}
              aria-label="Share on Facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </Button>
          </div>
        </div>
      </main>
    </>
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