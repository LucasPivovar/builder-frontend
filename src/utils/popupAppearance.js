export const popupAppearanceDefaults = {
  font: 'Montserrat', titleFont: 'Poppins', titleSize: 26, inputSize: 15, radius: 10,
  background: '#0d0d10', titleColor: '#ffffff', textColor: '#9ca3af', fieldBackground: '#17181c',
  fieldColor: '#ffffff', placeholder: '#636879', border: '#282932', accent: '#e5a924',
  badgeColor: '#1a1505', buttonBackground: '#e5a924', buttonColor: '#111111'
};
export function popupVariables(element) {
  const values = { ...popupAppearanceDefaults, ...element.appearance };
  if (/^#[\da-f]{6}$/i.test(values.primaryColor)) {
    values.accent = values.primaryColor;
    values.border = values.primaryColor;
    values.buttonBackground = values.primaryColor;
  }
  delete values.primaryColor;
  return Object.fromEntries(Object.entries(values).map(([key, value]) => {
    if (key === 'font' || key === 'titleFont') value = ['Montserrat', 'Poppins', 'Arial', 'Roboto'].includes(value) ? value : popupAppearanceDefaults[key];
    else if (['titleSize', 'inputSize', 'radius'].includes(key)) value = Math.min(key === 'titleSize' ? 60 : 32, Math.max(key === 'radius' ? 0 : 12, Number(value) || popupAppearanceDefaults[key])) + 'px';
    else value = /^#[\da-f]{6}$/i.test(value) ? value : popupAppearanceDefaults[key];
    return ['--sp-' + key, value];
  }));
}
export const popupThemeCss = `
.smart-popup-theme.smart-popup-theme.smart-popup-theme{background:var(--sp-background)!important;color:var(--sp-textColor)!important;font-family:var(--sp-font),sans-serif!important;border-color:var(--sp-border)!important}
.smart-popup-theme.smart-popup-theme.smart-popup-theme h2,.smart-popup-theme.smart-popup-theme.smart-popup-theme h3{font-family:var(--sp-titleFont),sans-serif!important;font-size:var(--sp-titleSize)!important;color:var(--sp-titleColor)!important;overflow-wrap:anywhere}
.smart-popup-theme.smart-popup-theme.smart-popup-theme p,.smart-popup-theme.smart-popup-theme.smart-popup-theme .sp-footer-trust{color:var(--sp-textColor)!important}
.smart-popup-theme.smart-popup-theme.smart-popup-theme input{background:var(--sp-fieldBackground)!important;color:var(--sp-fieldColor)!important;border-color:var(--sp-border)!important;font-family:var(--sp-font),sans-serif!important;font-size:var(--sp-inputSize)!important;border-radius:var(--sp-radius)!important}
.smart-popup-theme.smart-popup-theme.smart-popup-theme input::placeholder{color:var(--sp-placeholder)!important}
.smart-popup-theme.smart-popup-theme.smart-popup-theme .sp-top-badge{background:var(--sp-accent)!important;color:var(--sp-badgeColor)!important}
.smart-popup-theme.smart-popup-theme.smart-popup-theme .sp-icon-circle{color:var(--sp-accent)!important;border-color:var(--sp-accent)!important}
.smart-popup-theme.smart-popup-theme.smart-popup-theme .sp-icon-circle svg{color:var(--sp-accent)!important}
.smart-popup-theme.smart-popup-theme.smart-popup-theme button[type=submit],.smart-popup-theme.smart-popup-theme.smart-popup-theme .sp-submit-btn{background:var(--sp-buttonBackground)!important;color:var(--sp-buttonColor)!important;font-family:var(--sp-font),sans-serif!important;border-radius:var(--sp-radius)!important;box-shadow:none!important}
`;
