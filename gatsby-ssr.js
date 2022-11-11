/* eslint-disable import/prefer-default-export */
const React = require('react');

const BodyComponents = [
  // eslint-disable-next-line react/jsx-filename-extension
  <script
    dangerouslySetInnerHTML={{
      __html: `
(function() {
if (typeof window === 'undefined') return;

const isDarkModeSetInLocalStorage = localStorage.theme && JSON.parse(localStorage.theme) === 'dark';
const isSystemThemeEnabled = localStorage.theme && JSON.parse(localStorage.theme) === 'system' || !('theme' in localStorage);
const isSystemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;


if (isDarkModeSetInLocalStorage || (isSystemThemeEnabled && isSystemDarkMode)) {
document.documentElement.classList.add('dark');
} else {
document.documentElement.classList.remove('dark');
}

})()`,
    }}
    key="theme-picker"
  />,
];

exports.onRenderBody = ({ setHtmlAttributes, setPreBodyComponents }) => {
  setHtmlAttributes({ lang: 'en', prefix: 'og: http://ogp.me/ns#' });
  setPreBodyComponents(BodyComponents);
};
