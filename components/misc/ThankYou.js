import React from 'react'
import "../../styles/customStyles.css";



export default ({
    heading = "Frequently Asked Questions",
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  }) => {
        return (
            <div className="container">
                <h1>
                    {heading}
                </h1>
                <p>{description}</p>
                <style jsx>{`
                .container {
                    text-align: center;
                }
                p {
                    text-align: justify;
                    text-justify: inter-word;
                    padding: 25px 90px 25px 90px;
                    color : #7c8ba1;
                }
                h1 {
                    font-size: xx-large;
                    color: #000;
                }
                `}</style>
          </div>
            )
    }