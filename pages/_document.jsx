import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Rajdhani:wght@600&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/@sweetalert2/theme-material-ui@4.0.3/material-ui.min.css"
          />
          <script src="https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
