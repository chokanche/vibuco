import Head from 'next/head';
import Navbar from './Navbar';

const Layout = (props) => (
    <div>
        <Head>
            <title>VIBUCO</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="stylesheet"  href="https://bootswatch.com/4/minty/bootstrap.min.css" />
        </Head>
        <Navbar/>
        {props.children}
        <footer>
            <hr/>
            <span>
                I am here to stay (Footer).
            </span>
        </footer>
        </div>
);
export default Layout;