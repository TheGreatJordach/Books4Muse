import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import { simpleGit } from 'simple-git';

@Injectable()
export class FilesService {
  // Make paths relative to the root of the project
  private docDir = path.join(process.cwd(), 'dist', '.doc'); // Output directory for merged docs
  private uiDir = path.join(process.cwd(), 'dist', 'ui'); // Correct path for ui docs
  private apiDir = path.join(process.cwd(), 'dist', 'api'); // Correct path for api docs
  private git = simpleGit();

  async mergeDocs(): Promise<void> {
    try {
      // Remove the existing .doc folder if it exists
      if (await fs.pathExists(this.docDir)) {
        await fs.remove(this.docDir);
      }

      // Create the .doc folder in the dist directory
      await fs.mkdir(this.docDir);

      // Copy contents of ui and api directories into .doc
      await fs.copy(this.uiDir, this.docDir);
      await fs.copy(this.apiDir, this.docDir);

      console.log('Docs merged successfully!');

      // Trigger git commands to add, commit, and push the changes
      await this.commitAndPushChanges();
    } catch (error) {
      console.error('Error merging docs:', error);
      throw error;
    }
  }

  private async commitAndPushChanges(): Promise<void> {
    try {
      console.log('Adding changes to Git...');
      await this.git.add('./*'); // Adds all changes in the current directory

      console.log('Committing changes...');
      await this.git.commit('Update documentation with merged UI and API docs'); // Commit with a message

      console.log('Pushing changes to remote...');
      await this.git.push('origin', 'gh-pages'); // Push to the GitHub Pages branch (use `gh-pages` or your target branch)

      console.log('Changes successfully pushed to remote repository!');
    } catch (error) {
      console.error('Git operations failed:', error);
      throw error;
    }
  }
}
