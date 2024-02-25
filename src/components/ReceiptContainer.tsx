import { createWorker } from 'tesseract.js';
import { ErrorInfo, useState } from 'react';
import './ReceiptContainer.css';
import LoadingDots from './LoadingDots';

const ReceiptContainer = () => {
  const [imageText, setImageText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = event.target.files?.[0];
    if (file) {
      (`Selected Image: ${file.name}`); // Sets the image name before rendering text from image
      try {
        const worker = await createWorker('eng', 1, {
          logger: (m) => console.log(m),
        });
        const ret = await worker.recognize(file);
        setLoading(false);
        setImageText(ret.data.text);
        await worker.terminate();
      }
      catch (error) {
        console.error(`${error}`);
        setLoading(false);
        setImageText(`${error}`);
        alert(`${error}`);
      }
    }
  };
  // Split OCR text into lines
  const lines = imageText.split('\n');
  // Remove empty lines and trim whitespace
  const cleanLines = lines.filter(line => line.trim() !== '');
  // Map over the clean lines and render each line as a separate paragraph
  const renderedLines = cleanLines.map((line, index) => (
    <p key={index}>{line}</p>
  ));

  return (
    <div id="container">
      <form action="">
        <label htmlFor="imageInput">Upload Receipt Image</label>
        <input id="imageInput" type="file" onChange={handleImageInput} />
      </form>
      {loading && <LoadingDots />}
      <div className="items-list">
        {renderedLines}
      </div>
    </div>
  );
};

export default ReceiptContainer;
