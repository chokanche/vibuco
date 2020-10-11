import Head from 'next/head'

const isServer = typeof window === 'undefined'
const WOW = !isServer ? require('wow.js') : null



export default class Test extends React.Component {
    componentDidMount() {
        console.log("mounted")
        new WOW().init()
    }
    render() {

        return (
            <>
                <Head> 
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/animate.css@3.5.2/animate.min.css"/> 
                </Head>
            <div className="wow slideInLeft" data-wow-duration="2s">I'm animated!</div>
            </>
            )
    }
}