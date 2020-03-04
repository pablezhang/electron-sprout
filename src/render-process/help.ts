import fs from 'fs';
import path from 'path'

/**
 * 批量重命名
 * @param folderPath
 */
function batchRename(folderPath, renameFn ) {
  const _folderPath = path.resolve(process.cwd(), folderPath);
  console.log(_folderPath);
  let result = fs.readdirSync(_folderPath);
  result.forEach(fileName => {
    fs.rename(
      path.resolve(_folderPath, fileName),
      path.resolve(_folderPath, renameFn(fileName)), function (err) {
        // console.log('done');
      })
  })
}

batchRename('src/render-process/components', (_fileName) => _fileName.replace(/\.jsx/, '.tsx'))
