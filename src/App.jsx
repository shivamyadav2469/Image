import React, { useState } from "react";
import SearchPage from "./components/SearchPage";
import ImageCanvas from "./components/ImageCanvas";

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div>
    
    <div className="bg-gray-100 min-h-screen">
    <p>Name :  Shivam Yadav</p>
    <p>Email : shivamkumaryadav7024@gmail.com</p>
      {selectedImage ? (
        <ImageCanvas imageURL={selectedImage} />
      ) : (
        <SearchPage onImageSelect={(url) => setSelectedImage(url)} />
      )}
    </div>
    </div>
  );
};

export default App;
