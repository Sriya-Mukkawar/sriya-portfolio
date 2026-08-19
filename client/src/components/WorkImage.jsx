import { MdArrowOutward } from "react-icons/md";

const WorkImage = ({ image, alt, link, kind }) => (
  <div className={`work-image${kind === "icon" ? " work-image-icon" : ""}`}>
    <a
      className="work-image-in"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="work-link">
        <MdArrowOutward />
      </div>
      <img src={image} alt={alt} loading="lazy" decoding="async" />
    </a>
  </div>
);

export default WorkImage;
