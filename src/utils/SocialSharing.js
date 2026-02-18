/**
 * 📤 SOCIAL SHARING UTILITIES
 * Working share functions for Word of the Day and vocabulary
 */

/**
 * Share Word of the Day using native share API or fallback
 */
export async function shareWordOfDay(word) {
  const shareText = `🕌 Quran Word of the Day

${word.arabic} (${word.transliteration})
Meaning: ${word.meaning}

Root: ${word.root}
Category: ${word.category}
Appears ${word.occurrences} times in the Quran

Learn more Quranic vocabulary at [Your App URL]`;

  const shareData = {
    title: `Word of the Day: ${word.arabic}`,
    text: shareText,
    url: window.location.href
  };

  // Try native share API first (works on mobile)
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    } catch (error) {
      if (error.name === 'AbortError') {
        return { success: false, cancelled: true };
      }
      console.error('Share failed:', error);
    }
  }

  // Fallback: Copy to clipboard
  try {
    await navigator.clipboard.writeText(shareText);
    return { success: true, method: 'clipboard' };
  } catch (error) {
    console.error('Clipboard failed:', error);
    return { success: false, error };
  }
}

/**
 * Share to specific social media platforms
 */
export function shareToTwitter(word) {
  const text = `🕌 Quran Word of the Day:
${word.arabic} (${word.transliteration}) - ${word.meaning}

#QuranVocabulary #LearnArabic #IslamicEducation`;
  
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'width=550,height=420');
}

export function shareToFacebook() {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
  window.open(url, '_blank', 'width=550,height=420');
}

export function shareToWhatsApp(word) {
  const text = `🕌 *Quran Word of the Day*

*${word.arabic}* (${word.transliteration})
Meaning: ${word.meaning}

Root: ${word.root}
Appears ${word.occurrences} times in the Quran`;
  
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

export function shareToTelegram(word) {
  const text = `🕌 Quran Word of the Day

${word.arabic} (${word.transliteration})
${word.meaning}

Root: ${word.root}`;
  
  const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

/**
 * Copy word details to clipboard
 */
export async function copyWordToClipboard(word) {
  const text = `${word.arabic} (${word.transliteration})
${word.meaning}

Root: ${word.root}
Category: ${word.category}
Occurrences in Quran: ${word.occurrences}`;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

/**
 * Generate shareable image for Word of the Day
 */
export function generateWordImage(word) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630; // Optimal for social media
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#1a1446');
  gradient.addColorStop(1, '#0d7377');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Title
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '32px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('🕌 Quran Word of the Day', canvas.width / 2, 80);

  // Arabic word
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 120px Arial';
  ctx.fillText(word.arabic, canvas.width / 2, 250);

  // Transliteration
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = '48px Arial';
  ctx.fillText(word.transliteration, canvas.width / 2, 330);

  // Meaning
  ctx.font = 'bold 56px Arial';
  ctx.fillText(word.meaning, canvas.width / 2, 420);

  // Details
  ctx.font = '28px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText(`Root: ${word.root} | Category: ${word.category}`, canvas.width / 2, 500);
  ctx.fillText(`Appears ${word.occurrences} times in the Quran`, canvas.width / 2, 550);

  return canvas.toDataURL('image/png');
}

/**
 * Download word image
 */
export function downloadWordImage(word) {
  const dataURL = generateWordImage(word);
  const link = document.createElement('a');
  link.download = `quran-word-${word.arabic}-${word.meaning}.png`;
  link.href = dataURL;
  link.click();
}

/**
 * Share word image to social media
 */
export async function shareWordImage(word) {
  const dataURL = generateWordImage(word);
  
  // Convert data URL to blob
  const response = await fetch(dataURL);
  const blob = await response.blob();
  
  const file = new File([blob], `word-${word.arabic}.png`, { type: 'image/png' });

  // Try native share API with file
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: `Word of the Day: ${word.arabic}`,
        text: `${word.arabic} (${word.transliteration}) - ${word.meaning}`
      });
      return { success: true };
    } catch (error) {
      console.error('Share image failed:', error);
      return { success: false };
    }
  }

  // Fallback: Download image
  downloadWordImage(word);
  return { success: true, method: 'download' };
}

/**
 * Email share
 */
export function shareViaEmail(word) {
  const subject = `Word of the Day: ${word.arabic}`;
  const body = `🕌 Quran Word of the Day

${word.arabic} (${word.transliteration})
Meaning: ${word.meaning}

Root: ${word.root}
Category: ${word.category}
Appears ${word.occurrences} times in the Quran

Learn more Quranic vocabulary!`;

  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
}

/**
 * SMS/Text share (mobile)
 */
export function shareViaSMS(word) {
  const text = `🕌 Word of the Day: ${word.arabic} (${word.transliteration}) - ${word.meaning}`;
  const smsLink = `sms:?body=${encodeURIComponent(text)}`;
  window.location.href = smsLink;
}

export default {
  shareWordOfDay,
  shareToTwitter,
  shareToFacebook,
  shareToWhatsApp,
  shareToTelegram,
  copyWordToClipboard,
  generateWordImage,
  downloadWordImage,
  shareWordImage,
  shareViaEmail,
  shareViaSMS
};