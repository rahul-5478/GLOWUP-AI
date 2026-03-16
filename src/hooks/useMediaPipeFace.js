import { useEffect, useRef, useState, useCallback } from "react";

// ─── Face Shape from 468 Landmarks ───────────────────────────────────────────
export const calculateFaceShapeFromLandmarks = (landmarks) => {
  if (!landmarks || landmarks.length < 468) return null;

  const p = (i) => landmarks[i];

  // Key points
  const faceWidth = Math.abs(p(454).x - p(234).x);       // cheek to cheek
  const faceHeight = Math.abs(p(152).y - p(10).y);        // chin to forehead
  const foreheadWidth = Math.abs(p(389).x - p(162).x);    // temple to temple
  const jawWidth = Math.abs(p(397).x - p(172).x);         // jaw corners

  const widthToHeight = faceWidth / faceHeight;
  const foreheadToFace = foreheadWidth / faceWidth;
  const jawToFace = jawWidth / faceWidth;

  console.log("📐 MediaPipe ratios:", {
    widthToHeight: widthToHeight.toFixed(3),
    foreheadToFace: foreheadToFace.toFixed(3),
    jawToFace: jawToFace.toFixed(3),
  });

  if (widthToHeight > 0.85) {
    if (jawToFace > 0.75 && foreheadToFace > 0.75) return "square";
    return "round";
  }
  if (foreheadToFace > 0.85 && jawToFace < 0.72) return "heart";
  if (foreheadToFace < 0.72 && jawToFace < 0.72 && widthToHeight < 0.70) return "diamond";
  if (widthToHeight < 0.65) return "oblong";
  return "oval";
};

export const calculateJawlineType = (landmarks) => {
  if (!landmarks) return "defined";
  const jawWidth = Math.abs(landmarks[397].x - landmarks[172].x);
  const faceWidth = Math.abs(landmarks[454].x - landmarks[234].x);
  const ratio = jawWidth / faceWidth;
  if (ratio > 0.80) return "strong";
  if (ratio > 0.65) return "defined";
  return "soft";
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useMediaPipeFace() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceMeshRef = useRef(null);
  const cameraRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [liveFaceShape, setLiveFaceShape] = useState(null);
  const [liveJawline, setLiveJawline] = useState(null);
  const [error, setError] = useState("");

  const latestLandmarks = useRef(null);

  const drawMesh = useCallback((landmarks, canvas) => {
    if (!canvas || !landmarks) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dots
    ctx.fillStyle = "rgba(99,179,237,0.5)";
    landmarks.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 1.2, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Face outline
    const outline = [10,338,297,332,284,251,389,356,454,323,361,288,
      397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,
      234,127,162,21,54,103,67,109,10];
    ctx.beginPath();
    ctx.strokeStyle = "rgba(99,179,237,0.85)";
    ctx.lineWidth = 1.5;
    outline.forEach((idx, i) => {
      const pt = landmarks[idx];
      if (!pt) return;
      if (i === 0) ctx.moveTo(pt.x * canvas.width, pt.y * canvas.height);
      else ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height);
    });
    ctx.closePath();
    ctx.stroke();
  }, []);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const { FaceMesh } = await import("@mediapipe/face_mesh");
      const { Camera } = await import("@mediapipe/camera_utils");

      const faceMesh = new FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults((results) => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (canvas && video) {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
        }
        if (results.multiFaceLandmarks?.length > 0) {
          const landmarks = results.multiFaceLandmarks[0];
          latestLandmarks.current = landmarks;
          setFaceDetected(true);
          drawMesh(landmarks, canvas);
          setLiveFaceShape(calculateFaceShapeFromLandmarks(landmarks));
          setLiveJawline(calculateJawlineType(landmarks));
        } else {
          latestLandmarks.current = null;
          setFaceDetected(false);
          setLiveFaceShape(null);
          if (canvas) {
            canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
          }
        }
      });

      faceMeshRef.current = faceMesh;

      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (faceMeshRef.current && videoRef.current) {
            await faceMeshRef.current.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480,
      });

      await camera.start();
      cameraRef.current = camera;
      setIsReady(true);
      setIsLoading(false);
    } catch (err) {
      console.error("MediaPipe error:", err);
      setError("Camera start nahi hua. Permission check karo.");
      setIsLoading(false);
    }
  }, [drawMesh]);

  const stopCamera = useCallback(() => {
    if (cameraRef.current) { cameraRef.current.stop(); cameraRef.current = null; }
    if (faceMeshRef.current) { faceMeshRef.current.close(); faceMeshRef.current = null; }
    setIsReady(false);
    setFaceDetected(false);
    setLiveFaceShape(null);
  }, []);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    return { base64: dataUrl.split(",")[1], dataUrl };
  }, []);

  const getFaceAnalysis = useCallback(() => {
    if (!latestLandmarks.current) return null;
    return {
      faceShape: calculateFaceShapeFromLandmarks(latestLandmarks.current),
      jawlineType: calculateJawlineType(latestLandmarks.current),
    };
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  return {
    videoRef, canvasRef,
    isLoading, isReady,
    faceDetected, liveFaceShape, liveJawline,
    error, startCamera, stopCamera,
    captureFrame, getFaceAnalysis,
  };
}