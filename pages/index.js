import React from 'react';
import Layout from '../components/Layout';
import { photos } from "../components/photos";
import { background } from "../components/backgrounds";
import Gallery from "react-photo-gallery";
import Popup from '../components/Popup';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentImageIndex: 0,
            images: photos,
            imageBackgrounds: background,
            isFlipped: true,
            isPopup: false
        };

        this.flipp = this.flipp.bind(this);
        this.openLightbox = this.openLightbox.bind(this);
        this.closePopup = this.closePopup.bind(this);

      }
    flipp() {
        this.setState({isFlipped: !this.state.isFlipped});
    }
    openLightbox(_, { index }) {
        this.setState({ currentImageIndex: index, isPopup: true });
    }
    closePopup() {
        this.setState({ isPopup: false });
    }
    render() {
        const flipped = this.state.isFlipped;
        const imagesRendered = this.state.images;
        const imageBackgroundsRendered = this.state.imageBackgrounds;
        const currentImage = this.state.images[this.state.currentImageIndex];
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
                        ? <Gallery photos={imagesRendered} onClick={this.openLightbox} />
                        : <Gallery photos={imageBackgroundsRendered} onClick={this.openLightbox} />
                    }
                    {this.state.isPopup ? <Popup imgPath={currentImage.src} txt={currentImage.txt} onClose={this.closePopup} /> : null}
                </Layout>
            </>
    }
}

export default Index;