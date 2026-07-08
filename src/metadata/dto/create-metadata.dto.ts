import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateMetadataDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9_]+$/, {
    message:
      "Name must be uppercase with alphanumeric characters or underscores only.",
  })
  name: string; // e.g., "LITHIUM"

  @IsString()
  @IsNotEmpty()
  label: string; // e.g., "Lithium"
}
