import React from "react";

const ImageSearchResult = ({ image, onImageSelect }) => (
  <div className="image-result">
    <img src={image.urls.small} alt={image.alt_description} />
    <button onClick={() => onImageSelect(image.urls.regular)}>Add Captions</button>
  </div>
);

export default ImageSearchResult;
