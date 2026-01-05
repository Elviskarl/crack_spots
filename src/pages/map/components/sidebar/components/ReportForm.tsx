import { useState, useRef, type ChangeEvent } from "react";

export default function ReportForm() {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  function handleSubmit(formData: FormData) {
    const imageData = formData.get("file");
    console.log(imageData);
  }
  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    if (files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  }
  function handleClick() {
    fileInputRef.current?.click();
  }
  console.log(file);
  return (
    <section className="form-container">
      <form action={handleSubmit}>
        <div className="draggable-container">
          <input
            type="file"
            name="file"
            id="upload-file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e)}
          />
          <button onClick={handleClick}>Browse for a file</button>
        </div>
        <button className="submit-button">submit</button>
      </form>
    </section>
  );
}
