
  //Function to add days
  export function addDaysToDate(date:Date, days:number){
    var res = new Date(date);
    res.setDate(res.getDate() + days);
    return res;
}