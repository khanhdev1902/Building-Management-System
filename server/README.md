npx prisma migrate dev --name init
npx prisma generate

pnpm approve-builds

pnpm add @nestjs/config --read env