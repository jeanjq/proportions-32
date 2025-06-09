
// Re-export all types
export type { AvatarData, OutputData, ViewAngle } from '@/types/avatar';
export { AVAILABLE_VIEWS } from '@/types/avatar';

// Re-export matching functions
export { findClosestAvatarWithSize, findClosestAvatar, convertMeasurementToNumber } from './avatar/matching';

// Re-export image utilities
export { getAvatarPath, getAvatarViews } from './avatar/imageUtils';

// Re-export sizing utilities
export { calculateSize } from './avatar/sizing';

// Re-export mapping utilities
export { mapShapeToNumber, mapHipShapeToNumber, mapShoulderWidthToNumber, mapShoulderWidthToHipShape } from './avatar/mappingUtils';
