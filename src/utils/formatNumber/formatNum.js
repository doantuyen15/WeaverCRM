const formatNum = (num = '', decimals = 0, formatType = 'number') => {
   
   // Check if num is not a number
    if (isNaN(num)) return '';
    
    // Check if formatType is 'score'
    if (formatType === 'score') {
        return (Number(num) / Math.pow(10, decimals)).toFixed(decimals);
    }

    if (formatType === 'overall') {
        const score = Number(String(num).slice(0, 1));
        const decimalPart = Number(String(num).slice(1, -1));
        if (decimalPart >= 0.25 && decimalPart < 0.75) {
            return (score + 0.5).toFixed(1); // Làm tròn lên thành 0.5
        } else if (decimalPart >= 0.75) {
            return (score + 1).toFixed(1); // Làm tròn lên thành số nguyên
        } else {
            return score.toFixed(1); // Giữ nguyên giá trị làm tròn
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