import { useRef, useState, type RefObject } from "react";
import { copyToClipBoard } from "../utils/utils";
import checkMarkImageUrl from "../../../assets/checkmark-outline.svg";
import copyImageUrl from "../../../assets/copy-outline.svg";

export function EndpointContainer({
  content,
  el,
}: {
  content: string;
  el?: RefObject<HTMLElement | null>;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const baseUrlRef = useRef<HTMLSpanElement>(null);
  return (
    <div className="base-url">
      <span className="important" ref={baseUrlRef}>
        {content}
      </span>
      <div
        className="copy-image-container"
        title={`${isCopied ? "copied" : "copy"}`}
        onClick={() => {
          if (el?.current) {
            copyToClipBoard(el.current);
            setIsCopied(true);
            setTimeout(() => {
              setIsCopied(false);
            }, 2000);
            return;
          }
          if (!baseUrlRef.current) return;
          copyToClipBoard(baseUrlRef.current);
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 2000);
        }}
      >
        <img src={isCopied ? checkMarkImageUrl : copyImageUrl} alt="copy" />
      </div>
    </div>
  );
}
