/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'

interface WikipediaEvent {
  text: string
  year: number
  pages: Array<{ title: string; extract: string }>
}

interface NewsArticle {
  year: string
  text: string
  pages: Array<{ title: string; extract: string }>
}

interface CalendarNewsResponse {
  events: NewsArticle[]
  births: NewsArticle[]
  deaths: NewsArticle[]
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const dateParam = searchParams.get('date')

  let month: number
  let day: number

  if (dateParam) {
    const [paramMonth, paramDay] = dateParam.split('/').map(Number)
    if (isNaN(paramMonth) || isNaN(paramDay) || paramMonth < 1 || paramMonth > 12 || paramDay < 1 || paramDay > 31) {
      return NextResponse.json({ error: 'Invalid date format. Use MM/DD.' }, { status: 400 })
    }
    month = paramMonth
    day = paramDay
  } else {
    const today = new Date()
    month = today.getMonth() + 1 // JavaScript months are 0-indexed
    day = today.getDate()
  }

  try {
    const res = await fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`, {
      headers: {
        'User-Agent': 'NewsApp/1.0 (harshit@currentaffairs.website)',
      },
    })

    if (!res.ok) {
      const errorDetails = await res.text()
      return NextResponse.json(
        { error: `Failed to fetch calendar news: ${res.status} ${res.statusText}`, details: errorDetails },
        { status: res.status }
      )
    }

    const data: { events: WikipediaEvent[], births: WikipediaEvent[], deaths: WikipediaEvent[] } = await res.json()

    const formatEvents = (events: WikipediaEvent[]): NewsArticle[] => {
      return events.map(event => ({
        year: event.year.toString(),
        text: event.text,
        pages: event.pages.map(page => ({
          title: page.title,
          extract: page.extract
        }))
      }))
    }

    const response: CalendarNewsResponse = {
      events: formatEvents(data.events),
      births: formatEvents(data.births),
      deaths: formatEvents(data.deaths)
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error fetching calendar news:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}