/**
 * Universal Camera & Media Stream Hardware Manager.
 * 
 * Provides bulletproof camera hardware release:
 * - Monkeypatches navigator.mediaDevices.getUserMedia to globally track ALL video streams
 * - Instantly kills in-flight streams if user leaves the customer portal before resolution
 * - Completely stops all MediaStreamTracks (stop(), enabled = false, removeTrack())
 * - Purges all video elements in the DOM (pause(), srcObject = null, load())
 * - Immediately turns off webcam hardware LEDs on all browsers & platforms.
 */

const activeStreams = new Set<MediaStream>();
const activeTracks = new Set<MediaStreamTrack>();

let isCustomerPortalActive = false;

/**
 * Kill a specific MediaStream completely, ensuring hardware release.
 */
export function killStream(stream: MediaStream | null | undefined): void {
  if (!stream) return;
  try {
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      try {
        track.stop();
        track.enabled = false;
      } catch (e) {
        console.warn('[MediaManager] Error stopping track:', e);
      }
      try {
        stream.removeTrack(track);
      } catch (e) {}
      activeTracks.delete(track);
    });
  } catch (e) {
    console.warn('[MediaManager] Error killing stream:', e);
  }
  activeStreams.delete(stream);
}

/**
 * Register a MediaStream with global tracking.
 */
export function registerCameraStream(stream: MediaStream): void {
  if (!stream) return;
  activeStreams.add(stream);

  stream.getTracks().forEach((track) => {
    activeTracks.add(track);
    track.addEventListener('ended', () => {
      activeTracks.delete(track);
    });
  });

  if (typeof window !== 'undefined') {
    (window as any).__activeCameraStream = stream;
  }
}

/**
 * Unregister and stop a MediaStream.
 */
export function unregisterCameraStream(stream: MediaStream): void {
  if (!stream) return;
  killStream(stream);
}

/**
 * Set customer portal active status. When false, ALL hardware streams are stopped immediately.
 */
export function setCustomerPortalActive(active: boolean): void {
  isCustomerPortalActive = active;
  if (!active) {
    stopAllCameraHardware();
  }
}

export function getCustomerPortalActive(): boolean {
  return isCustomerPortalActive;
}

/**
 * Force stop all active camera tracks across the entire browser session.
 * Releases the camera hardware device and turns off camera LEDs immediately.
 */
export function stopAllCameraHardware(): void {
  isCustomerPortalActive = false;

  // 1. Force stop and purge all registered streams
  const streamsToKill = Array.from(activeStreams);
  streamsToKill.forEach((stream) => {
    killStream(stream);
  });
  activeStreams.clear();

  // 2. Force stop any orphaned MediaStreamTracks
  activeTracks.forEach((track) => {
    try {
      track.stop();
      track.enabled = false;
    } catch (e) {
      console.warn('[MediaManager] Error stopping orphan track:', e);
    }
  });
  activeTracks.clear();

  // 3. Clear window global references
  if (typeof window !== 'undefined') {
    if ((window as any).__activeCameraStream) {
      killStream((window as any).__activeCameraStream as MediaStream);
      (window as any).__activeCameraStream = null;
    }
  }

  // 4. Query all video elements in DOM and release their media pipeline completely
  if (typeof document !== 'undefined') {
    try {
      const videoElements = document.querySelectorAll('video');
      videoElements.forEach((video) => {
        try {
          video.pause();
        } catch (e) {}

        if (video.srcObject) {
          try {
            const stream = video.srcObject as MediaStream;
            if (stream && typeof stream.getTracks === 'function') {
              killStream(stream);
            }
          } catch (e) {}
          video.srcObject = null;
        }

        try {
          video.removeAttribute('src');
          video.load();
        } catch (e) {}
      });
    } catch (e) {}
  }
}

// =========================================================================
// UNIVERSAL BROWSER INTERCEPTOR FOR navigator.mediaDevices.getUserMedia
// =========================================================================
if (
  typeof window !== 'undefined' &&
  typeof navigator !== 'undefined' &&
  navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === 'function'
) {
  const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

  navigator.mediaDevices.getUserMedia = async function (
    constraints?: MediaStreamConstraints
  ): Promise<MediaStream> {
    // If customer portal is not active, refuse to activate hardware
    if (!isCustomerPortalActive) {
      const err = new DOMException('Camera access blocked: Customer portal is inactive', 'AbortError');
      return Promise.reject(err);
    }

    // Stop any existing stream before creating a new one to prevent hardware stacking
    const existingStreams = Array.from(activeStreams);
    existingStreams.forEach(s => killStream(s));

    try {
      const stream = await originalGetUserMedia(constraints);

      // Register immediately
      registerCameraStream(stream);

      // CRITICAL: Did the user navigate away or stop the camera while getUserMedia was resolving?
      if (!isCustomerPortalActive) {
        killStream(stream);
        const err = new DOMException('Camera cancelled: User navigated away while camera was initializing', 'AbortError');
        throw err;
      }

      return stream;
    } catch (error) {
      throw error;
    }
  };
}

// Global browser event listeners for guaranteed camera turn-off
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => stopAllCameraHardware());
  window.addEventListener('pagehide', () => stopAllCameraHardware());
  window.addEventListener('popstate', () => {
    if (!isCustomerPortalActive) {
      stopAllCameraHardware();
    }
  });
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAllCameraHardware();
      }
    });
  }
}
