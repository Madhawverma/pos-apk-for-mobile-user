/**
 * Returns a smart default emoji based on product name and category
 */
export function getProductEmoji(name: string = '', category: string = ''): string {
  const text = `${name} ${category}`.toLowerCase();

  // Lens keywords
  if (
    text.includes('lens') ||
    text.includes('lense') ||
    text.includes('blue cut') ||
    text.includes('crizal') ||
    text.includes('progressive') ||
    text.includes('bifocal') ||
    text.includes('single vision') ||
    text.includes('anti glare')
  ) {
    return '🔍'; // Lens emoji
  }

  // Sunglasses keywords
  if (
    text.includes('sunglass') ||
    text.includes('goggle') ||
    text.includes('shades') ||
    text.includes('polaroid') ||
    text.includes('wayfarer') ||
    text.includes('aviator')
  ) {
    return '🕶️'; // Sunglasses emoji
  }

  // Frame keywords
  if (
    text.includes('frame') ||
    text.includes('spectacle') ||
    text.includes('chashma') ||
    text.includes('rimless') ||
    text.includes('acetate') ||
    text.includes('titanium') ||
    text.includes('glasses')
  ) {
    return '👓'; // Frame / Eyeglasses emoji
  }

  // Contact Lens
  if (text.includes('contact') || text.includes('acuvue') || text.includes('solution')) {
    return '👁️';
  }

  // Accessories
  if (text.includes('case') || text.includes('cloth') || text.includes('clean') || text.includes('spray')) {
    return '🧰';
  }

  // Default fallback for optical store
  return '👓';
}

