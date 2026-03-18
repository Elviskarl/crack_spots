import { useRef } from "react";
import { EndpointContainer } from "./EndpointContainer";

export function CodeBlock({
  content,
  heading,
}: {
  content: string;
  heading?: string;
}) {
  const codeRef = useRef<HTMLElement>(null);
  return (
    <div className="code-block">
      <EndpointContainer
        content={
          heading
            ? heading
            : "https://crackspots-server.onrender.com/api/v1/reports"
        }
        el={codeRef}
      />
      <pre>
        <code ref={codeRef}>{content}</code>
      </pre>
    </div>
  );
}
