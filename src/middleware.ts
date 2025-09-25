import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest)
{
 const response = NextResponse.next()
 response.cookies.set('is', 'true')
 return response
}

export const config ={
    matcher: '/'
}