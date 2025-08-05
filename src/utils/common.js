const getFinancialYearRange = (date) => {
    const today = date ? new Date(date) : new Date();
    const currentMonth = today.getMonth() + 1; // Months are zero-indexed
  
    let currentYear = today.getFullYear();
  
    if (currentMonth > 3) {
      let nextYear = (today.getFullYear() + 1);
      return currentYear + "-" + nextYear;
    } else {
      let previousYear = (today.getFullYear() - 1);
      return previousYear + "-" +currentYear;
    }
}
  
export default getFinancialYearRange;