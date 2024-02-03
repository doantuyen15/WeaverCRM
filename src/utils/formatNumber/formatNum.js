const formatNum = (num = '', decimals = 0, formatType = 'number') => {
   
   // Check if num is not a number
    if (isNaN(num)) return 'Invalid input';
    
    // Check if formatType is 'score'
    if (formatType === 'score') {
        return (Number(num) / Math.pow(10, decimals)).toFixed(decimals);
    }
    
    // Check if formatType is 'number'
    if (formatType === 'number') {
        return Number(num).toLocaleString('vi-VI', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    if (formatType === 'price') {
        return Number(num).toLocaleString('vi-VI', {style : 'currency', currency : 'VND'});
    }

    return 'Invalid format type';
}

export default formatNum