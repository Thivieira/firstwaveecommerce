import Link from "next/link";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
const SiteLayout = ({ children }) => (
  <>
    <Header />
    {/* <ScrollToTop /> */}
    {children}
    <Footer />
  </>
);

export const getLayout = (page) => <SiteLayout>{page}</SiteLayout>;

export default SiteLayout;
