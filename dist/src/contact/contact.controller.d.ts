import { ContactService } from "./contact.service";
import { CreateContactMessageDto } from "./dto/create-contact-message.dto";
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    submitMessage(dto: CreateContactMessageDto): Promise<{
        success: boolean;
        message: string;
        id: string;
    }>;
}
