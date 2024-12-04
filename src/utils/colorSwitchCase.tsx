export function colorType(mimetype: string): string {
    switch (mimetype) {
        case "application/msword":
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return '#007bff'; // Word
        case "application/vnd.ms-powerpoint":
        case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            return '#ffc107'; // Powerpoint
        case "application/pdf":
            return '#fd6033'; // PDF
        case "video/mp4":
        case "video/x-msvideo":
        case "video/x-matroska":
        case "video/webm":
            return '#0b52cb'; // Video
        case "image/jpeg":
        case "image/png":
        case "image/gif":
        case "image/bmp":
        case "image/webp":
            return '#28a745'; // Image
        default:
            return '#007e43'; // Default color
    }
}