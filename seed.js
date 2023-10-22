import { spawn } from 'child_process';

console.log('Running seed script...');

// Run the seed script using child process
const seedProcess = spawn('node', ['seedData.js'], {
  stdio: 'inherit', // Pipe the child process's output to the parent process
});

seedProcess.on('close', (code) => {
  if (code === 0) {
    console.log('Seed script completed successfully.');
  } else {
    console.error('Seed script failed with exit code', code);
  }
});