import "../styles/globals.css";
import React from "react";

import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import theme from "../src/theme";


const cache = createCache({ key: "css", prepend: true });
cache.compat = true;

function MyApp({ Component, pageProps }) {
    return (
        <CacheProvider value={cache}>
            <Head>
                <title>Chat</title>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {/* <ContextProvider> */}
                    <Component {...pageProps} />
                {/* </ContextProvider> */}
            </ThemeProvider>
        </CacheProvider>
    );
}

export default MyApp;
