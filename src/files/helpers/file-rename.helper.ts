import { v4 as uuid } from 'uuid';

type CallbackFunction = (error: Error | null, result: string) => void;

export const fileRename = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: CallbackFunction,
) => {
  if (!file) return callback(new Error('No file provided'), 'No file provided');

  const fileExtension = file.mimetype.split('/')[1];
  const fileName = `${uuid()}.${fileExtension}`;

  callback(null, fileName);
};
