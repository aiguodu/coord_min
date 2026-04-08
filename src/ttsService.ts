let currentAudio: HTMLAudioElement | null = null;
let currentTimeout: number | null = null;

export async function playTTS(text: string, onProgress?: (p: number) => void): Promise<void> {
  stopTTS();

  try {
    // 尝试调用后端 TTS 接口
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!res.ok) throw new Error('TTS API failed');

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    currentAudio = new Audio(url);

    return new Promise((resolve, reject) => {
      if (!currentAudio) return resolve();
      
      currentAudio.onended = () => {
        if (onProgress) onProgress(100);
        resolve();
      };
      currentAudio.onerror = reject;
      
      // 模拟进度更新
      if (onProgress) {
        currentAudio.ontimeupdate = () => {
          if (currentAudio && currentAudio.duration) {
            onProgress((currentAudio.currentTime / currentAudio.duration) * 100);
          }
        };
      }
      
      currentAudio.play();
    });
  } catch (e) {
    console.warn('TTS API not available, using fallback simulation.', e);
    // 降级方案：根据文本长度模拟语音播放时长 (假设语速为每秒 4 个字)
    const durationMs = Math.max(2000, text.length * 250);
    const updateInterval = 100;
    let elapsed = 0;

    return new Promise((resolve) => {
      const simulate = () => {
        elapsed += updateInterval;
        if (onProgress) {
          onProgress(Math.min(100, (elapsed / durationMs) * 100));
        }
        
        if (elapsed >= durationMs) {
          resolve();
        } else {
          currentTimeout = window.setTimeout(simulate, updateInterval);
        }
      };
      currentTimeout = window.setTimeout(simulate, updateInterval);
    });
  }
}

export function stopTTS() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (currentTimeout) {
    window.clearTimeout(currentTimeout);
    currentTimeout = null;
  }
}
