import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from "class-validator";

export class CreateSiteDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  siteTypeId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  mineralTypeId: string;

  @IsNumber()
  @IsOptional()
  areaSize?: number;

  @IsString()
  @IsNotEmpty()
  kebeleId: string;

  @IsUrl()
  @IsOptional()
  googleMapsLink?: string;

  // ✅ Added Optional Media array representations to support validation mapping schemas
  @IsArray()
  @IsOptional()
  pictures?: string[];

  @IsString()
  @IsOptional()
  video?: string;

  @IsArray()
  @IsOptional()
  documents?: any[];

  @IsString()
  @IsOptional()
  receiptImage?: string;
}

export class UpdateSiteDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsUUID()
  siteTypeId?: string;

  @IsString()
  @IsOptional()
  @IsUUID()
  mineralTypeId?: string;

  @IsNumber()
  @IsOptional()
  areaSize?: number;

  @IsString()
  @IsOptional()
  kebeleId?: string;

  @IsUrl()
  @IsOptional()
  googleMapsLink?: string;

  // ✅ Added media update structures
  @IsArray()
  @IsOptional()
  pictures?: string[];

  @IsString()
  @IsOptional()
  video?: string;

  @IsArray()
  @IsOptional()
  documents?: any[];
}

export class VerifySiteDto {
  @IsIn(["VERIFIED", "REJECTED"])
  status: "VERIFIED" | "REJECTED";

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}

export class FilterSitesDto {
  @IsString()
  @IsOptional()
  zoneId?: string;

  @IsString()
  @IsOptional()
  woredaId?: string;

  @IsString()
  @IsOptional()
  kebeleId?: string;

  @IsString()
  @IsOptional()
  @IsUUID()
  siteTypeId?: string;

  @IsString()
  @IsOptional()
  @IsUUID()
  mineralTypeId?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sort?: string;

  @IsString()
  @IsOptional()
  page?: string;

  @IsString()
  @IsOptional()
  limit?: string;

  @IsString()
  @IsOptional()
  postedBy?: "CLIENT" | "STAFF";
}
export class UpdateStatusDto {
  @IsOptional()
  @IsString()
  verificationStatus?: "UNVERIFIED" | "VERIFIED" | "REJECTED";

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
