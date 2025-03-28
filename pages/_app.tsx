import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "@/components/common/Header";
import { Container } from "react-bootstrap";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Container className="mt-3">
        <Component {...pageProps} />
      </Container>
    </>
  );
}
