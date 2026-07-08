"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMetadataDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_metadata_dto_1 = require("./create-metadata.dto");
class UpdateMetadataDto extends (0, mapped_types_1.PartialType)(create_metadata_dto_1.CreateMetadataDto) {
}
exports.UpdateMetadataDto = UpdateMetadataDto;
//# sourceMappingURL=update-metadata.dto.js.map