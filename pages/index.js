import React from 'react';
import Layout from '../components/Layout';
import { photos } from "../components/photos";
import { background } from "../components/backgrounds";
import Gallery from "react-photo-gallery";

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.flipp = this.flipp.bind(this);
        this.state = {
            currentImage: 0,
            images: photos,
            imageBackgrounds: background,
            isFlipped: true,
        };
      }
    flipp() {
        this.setState({isFlipped: !this.state.isFlipped});
    }
    render() {
        const flipped = this.state.isFlipped;
        const imagesRendered = this.state.images;
        const imageBackgroundsRendered = this.state.imageBackgrounds;
        return <>
                <Layout>
                    <style jsx>{`
                            h1 {
                                text-align: center;
                                padding: 20px;
                            }
                        `}
                    </style>
                    <div>
                        <h1>
                            Welcome to Virtual Business Coach!
                        </h1>
                    </div>
                    <button onClick={this.flipp}>Flip cards</button>
                    {flipped
                        ? <Gallery photos = {imagesRendered} onClick={this.openLightbox} />
                        : <Gallery photos= {imageBackgroundsRendered} onClick={this.openLightbox} />
                    }
                </Layout>
            </>
    }
}

export default Index;