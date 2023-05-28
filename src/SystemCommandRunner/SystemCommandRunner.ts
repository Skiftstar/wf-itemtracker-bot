import { exec } from "child_process";

export const runCommand = (command: string, args: string[]) => {
    return new Promise((resolve, reject) => {
      const childProcess = exec(`${command} ${args.join(' ')}`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve({ stdout, stderr });
        }
      });
  
      childProcess.stdout!.pipe(process.stdout);
      childProcess.stderr!.pipe(process.stderr);
    });
  }
  