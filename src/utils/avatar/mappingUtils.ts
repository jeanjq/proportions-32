
/**
 * Map UI text values to numeric values that match the JavaScript files
 */
export function mapShapeToNumber(shape: 'flat' | 'round' | 'curvy'): string {
  switch (shape) {
    case 'flat': return '1';
    case 'round': return '2'; 
    case 'curvy': return '3';
    default: return '2';
  }
}

export function mapHipShapeToNumber(shape: 'slim' | 'regular' | 'full'): string {
  switch (shape) {
    case 'slim': return '1';
    case 'regular': return '2';
    case 'full': return '3';
    default: return '2';
  }
}

export function mapShoulderWidthToNumber(width: '1' | '2' | '3'): string {
  // The shoulder width values are already numbers from the UI
  return width;
}

/**
 * Map shoulder width values to hip shape values for CSV compatibility
 */
export function mapShoulderWidthToHipShape(shoulderWidth: '1' | '2' | '3'): 'slim' | 'regular' | 'full' {
  switch (shoulderWidth) {
    case '1': return 'slim';
    case '2': return 'regular';
    case '3': return 'full';
    default: return 'regular';
  }
}
