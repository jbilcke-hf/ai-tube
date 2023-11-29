
// note: there is no / at the end in the variable
// so we have to add it ourselves if needed
const apiUrl = process.env.VIDEOCHAIN_API_URL

export const GET = async <T>(path: string = '', defaultValue: T): Promise<T> => {
  try {
    const res = await fetch(`${apiUrl}/${path}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.SECRET_ACCESS_TOKEN}`,
      },
     cache: 'no-store',
     // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
     // next: { revalidate: 1 }
    })

    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    
    // Recommendation: handle errors
    if (res.status !== 200) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    
    const data = await res.json()

    return ((data as T) || defaultValue)
  } catch (err) {
    console.error(err)
    return defaultValue
  }
}


export const DELETE = async <T>(path: string = '', defaultValue: T): Promise<T> => {
  try {
    const res = await fetch(`${apiUrl}/${path}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.VC_SECRET_ACCESS_TOKEN}`,
      },
     cache: 'no-store',
     // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
     // next: { revalidate: 1 }
    })

    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    
    // Recommendation: handle errors
    if (res.status !== 200) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    
    const data = await res.json()

    return ((data as T) || defaultValue)
  } catch (err) {
    console.error(err)
    return defaultValue
  }
}

export const POST = async <S, T>(path: string = '', payload: S, defaultValue: T): Promise<T> => {
  try {
    const res = await fetch(`${apiUrl}/${path}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VC_SECRET_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(payload),
      // cache: 'no-store',
      // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
      next: { revalidate: 1 }
    })
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    
    // Recommendation: handle errors
    if (res.status !== 200) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to post data')
    }
    
    const data = await res.json()

    return ((data as T) || defaultValue)
  } catch (err) {
    return defaultValue
  }
}


export const PUT = async <S, T>(path: string = '', payload: S, defaultValue: T): Promise<T> => {
  try {
    const res = await fetch(`${apiUrl}/${path}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VC_SECRET_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(payload),
      // cache: 'no-store',
      // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
      next: { revalidate: 1 }
    })
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    
    // Recommendation: handle errors
    if (res.status !== 200) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to post data')
    }
    
    const data = await res.json()

    return ((data as T) || defaultValue)
  } catch (err) {
    return defaultValue
  }
}

export const PATCH = async <S, T>(path: string = '', payload: S, defaultValue: T): Promise<T> => {
  try {
    const res = await fetch(`${apiUrl}/${path}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VC_SECRET_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(payload),
      // cache: 'no-store',
      // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
      next: { revalidate: 1 }
    })
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    
    // Recommendation: handle errors
    if (res.status !== 200) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to post data')
    }
    
    const data = await res.json()

    return ((data as T) || defaultValue)
  } catch (err) {
    return defaultValue
  }
}