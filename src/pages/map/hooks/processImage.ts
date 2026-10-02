import {
  isInNairobi,
  readFile,
  resizeImage,
  validateFile,
} from "../utils/utils";
import { CustomError } from "../../../components/error/CustomError";
import useMapContext from "./getMapContext";

interface Params {
  file: File;
}

export default function useProcessImage() {
  const { nairobiSubCountyShapefile, setIsNotInNairobi } = useMapContext();

  async function processImage({ file }: Params) {
    const { fileType, isValid } = validateFile(file);

    if (!isValid) {
      throw new CustomError(
        "INVALID_FILE_TYPE",
        `Please upload a JPG, PNG, or WEBP image. Received: ${fileType}`,
      );
    }

    const data = await readFile(file);
    const within = isInNairobi(
      data.GPSLatitude,
      data.GPSLongitude,
      nairobiSubCountyShapefile.current!,
    );

    if (!within) {
      setIsNotInNairobi(true);
      throw new CustomError(
        "LOCATION_MISMATCH",
        "Reports must be located within Nairobi County.",
      );
    }

    const resizedImage = await resizeImage(file);
    return { resizedImage, data };
  }
  return { processImage };
}
