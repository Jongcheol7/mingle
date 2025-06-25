// lib/prisma.ts

import { PrismaClient } from "@prisma/client";

// globalThis는 Node 전역객체이고 Typescript 에서 타입 오류를 없애기 위한
// 타입 단언이라고 생각하면 된다.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// prisma가 이미 전역에 존재하면 그것을 사용하고, 없으면 새로 생성하는 코드이다.
// a ?? b 문법은 a가 null이거나 undefinded 일때 b 사용
// a || b 문법은 a가 falsy일때 즉 null,undefinded,false,0,'' 일때 b 사용
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
