import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.text()
  const resp = await fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_API_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body,
  })
  const data = await resp.json()
  return NextResponse.json(data)
}

export function GET() {
  return NextResponse.json({ ok: true, info: 'GraphQL BFF activo. Use POST.' })
}

export function HEAD() {
  return NextResponse.json(null, { status: 200 })
}
