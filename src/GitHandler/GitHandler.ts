import { runCommand } from "../SystemCommandRunner/SystemCommandRunner";

export const pushChanges = (commitName: string, callback?: Function) => {
    pullChangesCommitAndPush(commitName, callback)
}


async function pullChangesCommitAndPush(commitName: string, callback?: Function) {
    try {
      // Pull changes from the Git repository
      await runCommand('git', ['pull']);
  
      // Perform any necessary operations here
  
      // Commit the changes
      await runCommand('git', ['add', '.']);
      await runCommand('git', ['commit', '-m', `"${commitName}"`]);
  
      // Push the changes to the Git repository
      await runCommand('git', ['push']);
  
      // Call the callback function once the push succeeds
      if (typeof callback === 'function') {
        callback();
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }