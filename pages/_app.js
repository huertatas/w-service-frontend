import "../styles/globals.scss";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

function MyApp({ Component, pageProps }) {
  return (
    <MantineProvider theme={{ fontFamily: "Aeonik" }}>
      <NotificationsProvider>
        <Component {...pageProps} />
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default MyApp;
