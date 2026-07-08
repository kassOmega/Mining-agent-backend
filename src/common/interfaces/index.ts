// backend/src/common/interfaces/index.ts

export interface JwtPayload {
  sub: string;
  email: string;
  role: "ADMIN" | "MODERATOR" | "CLIENT";
}

export interface SiteWithRelations {
  id: string;
  userId: string;
  kebeleId: string;
  title: string;
  description: string;
  siteType: string;
  mineralType: string;
  areaSize: number | null;
  pictures: string;
  video: string | null;
  googleMapsLink: string | null;
  status: string;
  isFeatured: boolean;
  rejectionReason: string | null;
  verifiedAt: Date | null;
  verifiedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    fullName: string;
    phone: string | null;
  };
  kebele: {
    id: string;
    name: string;
    woreda: {
      id: string;
      name: string;
      zone: {
        id: string;
        name: string;
      };
    };
  };
  verifier?: {
    id: string;
    fullName: string;
  } | null;
}
