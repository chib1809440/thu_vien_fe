import { useState } from "react";

interface ImageProps {
    src: string,
    width?: string,
    height?: string,
    alt?: string,
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any; // Để hỗ trợ các thuộc tính khác của thẻ img
}
function ImageComponent({ 
    src, 
    alt, 
    height, 
    width, 
    className,
    style,
    ...props 
}: ImageProps) {
    const [source, setSource] = useState(src);

    const handleImageError = () => {
        setSource("./images/nodata/document-blank.png");
    };
    return (

        <img
            src={source}
            alt={alt}
            height={height}
            width={width}
            onError={handleImageError}
            className={className}
            style={style}
            {...props}
        />

    );
}

export default ImageComponent;