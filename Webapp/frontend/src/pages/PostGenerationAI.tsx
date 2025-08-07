import React from "react";
import ContentChat from "./ContentChat";

export default function PostGenerationAI(props: any) {
  return (
    <div>
      <div style={{ marginTop: 24 }}>
        <ContentChat {...props} />
      </div>
    </div>
  );
}
