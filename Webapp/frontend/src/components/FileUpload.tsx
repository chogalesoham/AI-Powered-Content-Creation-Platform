import React from "react";

export default function FileUpload({
  onUpload,
}: {
  onUpload: (file: File) => void;
}) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-10 h-10 flex items-center justify-center bg-gradient-to-tr from-purple-500 to-purple-700 text-white text-xl font-bold rounded-lg shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed pb-1"
        type="button"
      >
        +
      </button>
    </div>
  );
}
