import { wrapper } from "src/store";
import "../styles/globals.scss";
import Navbar from "src/components/Navbar";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default wrapper.withRedux(MyApp);
