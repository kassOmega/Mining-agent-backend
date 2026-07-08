import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { CreateContactMessageDto } from "./dto/create-contact-message.dto";

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async createMessage(dto: CreateContactMessageDto) {
    try {
      const contactMessage = await this.prisma.contactMessage.create({
        data: {
          name: dto.name,
          email: dto.email,
          phone: dto.phone || null,
          subject: dto.subject,
          message: dto.message,
        },
      });

      return {
        success: true,
        message: "Your message has been captured successfully.",
        id: contactMessage.id,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to process and store contact message.",
      );
    }
  }
}
