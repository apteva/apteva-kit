/**
 * Theme initialization script that runs before React hydration
 * This prevents flickering by setting the theme before the page renders
 * Must be inlined in the HTML <head> as a blocking script
 */

export const themeScript = `
(function() {
  try {
    // Get system preference
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const colorMode = isDark ? 'dark' : 'light';

    // Set attributes before render
    document.documentElement.setAttribute('data-color-mode', colorMode);

    // Add dark class for Tailwind
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    console.error('Failed to initialize theme:', e);
  }
})();
`;

export function getThemeScript() {
  return themeScript;
}
