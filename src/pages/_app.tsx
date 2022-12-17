import { AppProps } from 'next/app';
import { Header } from '../components/Header'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import '../styles/global.scss'

import { Provider as NextAuthProvider } from 'next-auth/client';


const initialOptions = {
  "client-id": "AV-Q6SfTTNwxE1UFbr0RDxvUSJ9zjcTWbqrbxmdee4tD_7qQX8ze26E82iQVoV4F9_hXAWAeQIC8Gekt",
  currency: "BRL",
  intent: "capture"
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <PayPalScriptProvider options={ initialOptions }>
        <Header />
        <Component {...pageProps} />
      </PayPalScriptProvider>
    </NextAuthProvider>
  )
}

export default MyApp
