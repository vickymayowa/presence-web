const { execSync } = require('child_process');
const fs = require('fs');

try {
    console.log("Starting prisma sync...");
    const output = execSync('npx prisma db push --accept-data-loss && npx prisma generate', { encoding: 'utf8' });
    fs.writeFileSync('prisma_output.txt', output);
    console.log("Prisma sync completed.");
} catch (error) {
    fs.writeFileSync('prisma_output.txt', error.stdout + "\n" + error.stderr + "\n" + error.message);
    console.error("Prisma sync failed.");
}
