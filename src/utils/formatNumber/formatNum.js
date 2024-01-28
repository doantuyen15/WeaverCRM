function formatNum(num, decimals = 0, formatType = 'number') {
   
   // Check if num is not a number
    if (isNaN(num)) return 'Invalid input';
    
    // Check if formatType is 'score'
    if (formatType === 'score') {
        return (num / Math.pow(10, decimals)).toFixed(decimals);
    }
    
    // Check if formatType is 'number'
    if (formatType === 'number') {
        return num.toLocaleString('vi-VI', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    return 'Invalid format type';
}