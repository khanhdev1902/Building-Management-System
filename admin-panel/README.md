├── app/ #routing (Next App Router)
│
├── features/ #domain chính
│ ├── auth/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── services/
│ │ ├── api/
│ │ ├── store/
│ │ └── types.ts
│ │
│ ├── product/
│ ├── order/
│ └── user/
│
├── shared/ # UI + utils dùng chung = reusable + không dính nghiệp vụ
│ ├── components/
│ ├── hooks/
│ ├── utils/
│ └── constants/
│
├── services/ # axios instance global
├── lib/ # config (auth, cookie, token)
├── store/ # global state
├── config/ # env config
└── types/

"use client";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function Profile() {
  const user = useAuthStore((s) => s.user);

  return <div>{user?.name}</div>;
}