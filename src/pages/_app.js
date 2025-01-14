import { Provider } from 'react-redux'
import { store, persistor } from '../app/store'
import '../styles/globals.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { auth } from '../firebase'
import { PersistGate } from 'redux-persist/integration/react'

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your Amazon experience...</p>
      </div>
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const publicPages = ['/auth/signin', '/auth/register'] 
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user && !publicPages.includes(router.pathname)) {
        router.push('/auth/signin')
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [router, publicPages])

  if (isLoading) return <Loading />

  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  )
}

export default MyApp