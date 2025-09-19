
/**
 * Captures the current frame from an HTMLVideoElement and returns it as a data URL.
 * @param videoElement The video element to capture the frame from.
 * @returns A string containing the data URL of the captured frame (JPEG format).
 */
export const captureFrame = (videoElement: HTMLVideoElement): string => {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get 2D context from canvas');
  }

  // Flip the image horizontally as the video feed is mirrored
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
  // Convert the canvas to a data URL
  return canvas.toDataURL('image/jpeg', 0.9); // Use JPEG with 90% quality
};
