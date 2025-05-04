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