/**
 * Theme debug mode
 *
 * Enable: sessionStorage.setItem('themeDebug', 'true')
 * Disable: sessionStorage.removeItem('themeDebug')
 *
 * Enables detailed console logging for BNPL, polling, and other theme operations.
 */
window.bigcartel = window.bigcartel || {};
window.bigcartel.theme = window.bigcartel.theme || {};
window.bigcartel.theme.DEBUG = (function() {
  try {
    return sessionStorage.getItem('themeDebug') === 'true';
  } catch (e) {
    return false;
  }
})();

/**
 * Debug logging utility (global)
 * Available globally throughout the theme. Only logs when theme debug mode is enabled.
 *
 * @param {string} category - Log category (e.g., 'BNPL', 'Polling', 'Cart')
 * @param {...*} args - Arguments to log (supports multiple arguments like console.log)
 *
 * @example
 * debugLog('BNPL', 'Skipping re-render - price unchanged ($' + finalPrice + ')');
 * debugLog('Polling', 'Check #' + attemptCount + ' at ' + elapsed + 'ms');
 */
function debugLog(category) {
  if (window.bigcartel && window.bigcartel.theme && window.bigcartel.theme.DEBUG) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift('[' + category + ']');
    if (typeof console !== 'undefined' && console.log) {
      console.log.apply(console, args);
    }
  }
}

function camelCaseToDash(string) {
  return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Format a number as currency based on the shop's settings
 * 
 * @param {number} amount - The amount to format
 * @param {boolean} [withDelimiter=true] - Whether to include thousands delimiter (ignored, kept for compatibility)
 * @param {boolean} [withSign=true] - Whether to include currency symbol
 * 
 * @param {boolean} [withCode=false] - Whether to include currency code
 * @returns {string} Formatted currency string
 */
function formatMoney(amount, withDelimiter = true, withSign = true, withCode = false) {
  const currency = window.bigcartel?.account?.currency || 'USD';
  const locale = navigator.language || 'en-US';
  const moneyFormat = window.bigcartel?.account?.moneyFormat || 'sign';
  
  switch (moneyFormat) {
    case 'sign':
      withSign = true;
      withCode = false;
      break;
    case 'code':
      withSign = false;
      withCode = true;
      break;
    case 'none':
      withSign = false;
      withCode = false;
      break;
    default:
      withSign = true;
      withCode = false;
  }
  
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  });
  
  let result;
  
  if (withSign) {
    result = currencyFormatter.format(amount);
  } else {
    const formatParts = currencyFormatter.formatToParts(amount);
    const fractionPart = formatParts.find(part => part.type === 'fraction');
    
    const decimalFormatter = new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: fractionPart ? fractionPart.value.length : 0,
      maximumFractionDigits: fractionPart ? fractionPart.value.length : 0
    });
    
    result = decimalFormatter.format(amount);
  }
  
  if (withCode) {
    result += ' <span class="currency_code">' + currency + '</span>';
  }
  
  return result;
}

/**
 * Check if a URL is external (different hostname) or internal
 * @param {string} url - The URL to check
 * @returns {boolean} True if external, false if internal
 */
function isExternalLink(url) {
  if (!url) return false;
  
  try {
    const linkUrl = new URL(url, window.location.origin);
    return linkUrl.hostname !== window.location.hostname;
  } catch (e) {
    // Invalid URL, treat as internal
    return false;
  }
}