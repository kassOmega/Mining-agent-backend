import { PrismaService } from "../common/prisma.service";
import { CreateContactMessageDto } from "./dto/create-contact-message.dto";
export declare class ContactService {
    private prisma;
    constructor(prisma: PrismaService);
    createMessage(dto: CreateContactMessageDto): Promise<{
        success: boolean;
        message: string;
        id: string;
    }>;
}
