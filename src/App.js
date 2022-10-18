import "./App.css";
import * as tf from "@tensorflow/tfjs";
import React, { useEffect, useState } from "react";

function App() {
  const [model, setModel] = useState();
  const [isReady, setIsReady] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [imageArray, setImageArray] = useState(null);

  useEffect(() => {
    /**
     * Loads the layer model by uploading the model.json file into github.
     * @returns A `Promise` of the model or an undefined error.
     */
    async function loadLayers() {
      let url =
        "https://raw.githubusercontent.com/coolmanbat2/mlproject/master/static/model.json";
      try {
        const promise_model = await tf.loadLayersModel(url);
        console.log("Successfully loaded model!");
        setModel(promise_model);
        setIsReady(true);
      } catch (err) {
        console.log("Failed to load model");
      }
    }
    loadLayers();
  }, []);

  // Checks if model is ready
  if (isReady) {
    return (
      <div className="upload-image">
        Choose image
        <input
          type="file"
          accept="image/jpeg"
          onChange={(image) => {
            const file = image.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);

            // Process the image via the model and preview it for the users.
            reader.onload = () => {

              // Converts local image into tensor.
              const im = new Image();
              im.src = reader.result;
              im.height = 40;
              im.width = 40;
              im.onload = () => {
                // Editing the size of the image in order for it to comply with the model
                let imageTensor = tf.browser.fromPixels(im, 3);
                imageTensor = imageTensor.expandDims(0);
                const result = model.predict(imageTensor);
                
                console.log(result); // Returns Tensor object, but not sure what to do with it?
              };

              setUserImage(im.src);
            };
          }}
        />
        <div className="image">
          <img src={userImage} alt="user_image" />
        </div>
      </div>
    );
  }
}

export default App;
