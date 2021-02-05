import '../styles/globals.css'
import Head from "next/head";
import {Provider} from "jotai";

//components
import GlobalError from "@components/GlobalError";
import GlobalSuccess from "@components/GlobalSuccess";

function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <Head>
        <link rel="shortcut icon" href='/favicons/favicon.ico'/>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Dosis:wght@300;500;600&display=swap" rel="stylesheet"/>
      </Head>
      <GlobalSuccess/>
      <GlobalError/>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp;
