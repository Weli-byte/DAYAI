// Minimal ambient declaration for Express.Multer.File
// Used until @types/multer is installed via pnpm.
declare global {
  namespace Express {
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer;
        stream: NodeJS.ReadableStream;
      }
    }
  }
}

export {};
