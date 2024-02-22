const formatNum = (num = '', decimals = 0, formatType = 'number') => {
   
   // Check if num is not a number
    if (isNaN(num)) return '';
    
    // Check if formatType is 'score'
    if (formatType === 'score') {
        return (Number(num) / Math.pow(10, decimals)).toFixed(decimals);
    }

    if (formatType === 'overall') {
        if (Number(num) >= 10) return Number(10).toFixed(1)
        const score = Number(String(num).slice(0, 1));
        const decimalPart = Number(String((num || 0).toFixed(2)).slice(2,4));
        if (decimalPart >= 25 && decimalPart < 75) {
            return (score + 0.5).toFixed(1);
        } else if (decimalPart >= 75) {
            return (score + 1).toFixed(1);
        } else {
            return score.toFixed(1);
        }
    }

    // Check if formatType is 'number'
    if (formatType === 'number') {
        return Number(num).toLocaleString('en', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    if (formatType === 'price') {
        return Number(num).toLocaleString('en', {style : 'currency', currency : 'VND'});
    }

    return 'Invalid format type';
}

export default formatNum