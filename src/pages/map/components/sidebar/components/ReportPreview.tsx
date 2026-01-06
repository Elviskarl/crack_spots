interface Params {
  url: string;
}
export default function ReportPreview(props: Params) {
  return (
    <div className="image-preview-container">
      <img src={props.url} alt="Road Damage" className="preview-image" />
    </div>
  );
}
