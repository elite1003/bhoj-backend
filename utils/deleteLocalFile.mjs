import fs from "fs";
export const deleteLocalFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error(`Failed to delete local file: ${err}`);
  });
};
