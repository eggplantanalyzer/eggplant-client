export const parseRGBString = (rgbString) => {
  // Handle both formats: "RGB(r,g,b)" and "[r,g,b]"
  const matches = rgbString.match(/\d+/g);
  if (matches && matches.length === 3) {
    return `rgb(${matches[0]}, ${matches[1]}, ${matches[2]})`;
  }
  return 'rgb(0, 0, 0)'; // fallback color
}; 