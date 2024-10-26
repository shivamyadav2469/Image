import React, { useEffect, useRef, useCallback } from 'react';
import { fabric } from 'fabric';

const ImageCanvas = ({ imageURL }) => {
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);

  useEffect(() => {
    // Initialize the Fabric canvas
    canvasInstance.current = new fabric.Canvas(canvasRef.current, {
      selection: true,
    });

    // Set up canvas dimensions and resize handler
    const resizeCanvas = () => {
      const canvas = canvasInstance.current;
      canvas.setWidth(canvasRef.current.parentElement.offsetWidth);
      canvas.setHeight(canvasRef.current.parentElement.offsetHeight);
      canvas.renderAll();
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Load the image as the canvas background
    fabric.Image.fromURL(
      imageURL,
      (img) => {
        img.set({
          selectable: false,
          scaleX: canvasInstance.current.width / img.width,
          scaleY: canvasInstance.current.height / img.height,
        });
        canvasInstance.current.setBackgroundImage(img, canvasInstance.current.renderAll.bind(canvasInstance.current));
      },
      { crossOrigin: 'anonymous' }
    );

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvasInstance.current.dispose();
    };
  }, [imageURL]);

  // Add Text Layer
  const addText = useCallback(() => {
    const text = new fabric.Textbox("Your Caption", {
      left: 50,
      top: 50,
      fill: "#ffffff",
      fontSize: 24,
      editable: true,
    });
    text.setControlsVisibility({ mtr: false });
    canvasInstance.current.add(text);
    text.bringToFront(); // Ensure the text is on top of all shapes
  }, []);

  // Add Shape Layer
  const addShape = useCallback((shapeType) => {
    let shape;
    if (shapeType === "circle") {
      shape = new fabric.Circle({ radius: 50, fill: "red", left: 100, top: 100 });
    } else if (shapeType === "triangle") {
      shape = new fabric.Triangle({ width: 100, height: 100, fill: "blue", left: 100, top: 100 });
    } else if (shapeType === "rectangle") {
      shape = new fabric.Rect({ width: 100, height: 60, fill: "green", left: 100, top: 100 });
    } 
    if (shape) {
      shape.setControlsVisibility({ mtr: false });
      shape.set({ selectable: true });
      canvasInstance.current.add(shape);
      shape.sendToBack(); // Ensure shapes are behind text layers
    }
  }, []);

  // Remove selected element
  const removeSelected = useCallback(() => {
    const activeObject = canvasInstance.current.getActiveObject();
    if (activeObject) {
      canvasInstance.current.remove(activeObject);
    }
  }, []);

  // Download Canvas Image
  const downloadImage = useCallback(() => {
    const link = document.createElement("a");
    link.href = canvasInstance.current.toDataURL({ format: "png" });
    link.download = "edited-image.png";
    link.click();
  }, []);

  return (
    <div className="container mx-auto p-6 text-center">
      <div className="flex justify-center">
        <div className="bg-gray-800 p-4 rounded-lg mb-4 h-[600px] w-[800px]">
          <canvas ref={canvasRef} width="768px" height="560px" className="border rounded-lg shadow-lg"></canvas>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <button onClick={addText} className="bg-green-500 text-white px-4 py-2 rounded-lg">Add Text</button>
        <button onClick={() => addShape("circle")} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Add Circle</button>
        <button onClick={() => addShape("rectangle")} className="bg-yellow-500 text-white px-4 py-2 rounded-lg">Add Rectangle</button>
        <button onClick={() => addShape("triangle")} className="bg-red-500 text-white px-4 py-2 rounded-lg">Add Triangle</button>
        {/* <button onClick={() => addShape("polygon")} className="bg-purple-500 text-white px-4 py-2 rounded-lg">Add Polygon</button> */}
        <button onClick={removeSelected} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Remove Selected</button>
        <button onClick={downloadImage} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Download Image</button>
      </div>
    </div>
  );
};

export default ImageCanvas;
