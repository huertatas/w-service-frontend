import "../styles/globals.scss";
import { MantineProvider } from "@mantine/core";

function MyApp({ Component, pageProps }) {
  return (
    <MantineProvider theme={{ fontFamily: "Aeonik" }}>
      <Component {...pageProps} />
    </MantineProvider>
  );
}

export default MyApp;
