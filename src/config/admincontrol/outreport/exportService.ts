import xlsx from "xlsx";
import path from "path";

export const exportExcel = (
  data: any,
  workSheetColumnNames:string[],
  workSheetName: string,
  filePath: string
) => {
  const workBook = xlsx.utils.book_new();
  const workSheetData = [workSheetColumnNames, ...data];
  const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
  xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
  xlsx.writeFile(workBook, path.resolve(filePath));
};

export const exportUsersToExcel = (
  users:any,
  workSheetColumnNames:  string[],
  workSheetName: string,
  filePath: string
) => {
  const data = users.map((user:any) => {
    return [user.id, user.name, user.age];
  });
  exportExcel(data, workSheetColumnNames, workSheetName, filePath);
};
