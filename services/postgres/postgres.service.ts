import { prisma } from "../../lib/db";
import { UserService } from "./user.service";
import { BoardService } from "./board.service";
import { ImageService } from "./image.service";
import { AssociationMemberService } from "./associationMember.service";
import { ChapterService } from "./chapter.service";
import { MemberRoleService } from "./memberRole.service";
import { GalleryService } from "./gallery.service";
import { PartnerService } from "./partner.service";
import { SchoolService } from "./school.service";
import { CountryService } from "./country.service";
import { CityService } from "./city.service";
import { PoleService } from "./pole.service";
import { MemberMandateService } from "./memberMandate.service";
import { PublicationService } from "./publication.service";
import { TimelineEntryService } from "./timelineEntry.service";
import { AssociationSectionService } from "./associationSection.service";
import { StatService } from "./stat.service";
import { EventService } from "./event.service";
import { SpeakerService } from "./speaker.service";
import { SponsorService } from "./sponsor.service";

export class PostgresService {
  private static instance: PostgresService;

  public userServices: UserService;
  public boardServices: BoardService;
  public imageServices: ImageService;
  public associationMemberServices: AssociationMemberService;
  public chapterServices: ChapterService;
  public memberRoleServices: MemberRoleService;
  public galleryServices: GalleryService;
  public partnerServices: PartnerService;
  public schoolServices: SchoolService;
  public countryServices: CountryService;
  public cityServices: CityService;
  public poleServices: PoleService;
  public memberMandateServices: MemberMandateService;
  public publicationServices: PublicationService;
  public timelineEntryServices: TimelineEntryService;
  public associationSectionServices: AssociationSectionService;
  public statServices: StatService;
  public eventServices: EventService;
  public speakerServices: SpeakerService;
  public sponsorServices: SponsorService;

  private constructor() {
    this.userServices = new UserService(prisma);
    this.boardServices = new BoardService(prisma);
    this.imageServices = new ImageService(prisma);
    this.associationMemberServices = new AssociationMemberService(prisma);
    this.chapterServices = new ChapterService(prisma);
    this.memberRoleServices = new MemberRoleService(prisma);
    this.galleryServices = new GalleryService(prisma);
    this.partnerServices = new PartnerService(prisma);
    this.schoolServices = new SchoolService(prisma);
    this.countryServices = new CountryService(prisma);
    this.cityServices = new CityService(prisma);
    this.poleServices = new PoleService(prisma);
    this.memberMandateServices = new MemberMandateService(prisma);
    this.publicationServices = new PublicationService(prisma);
    this.timelineEntryServices = new TimelineEntryService(prisma);
    this.associationSectionServices = new AssociationSectionService(prisma);
    this.statServices = new StatService(prisma);
    this.eventServices = new EventService(prisma);
    this.speakerServices = new SpeakerService(prisma);
    this.sponsorServices = new SponsorService(prisma);
  }

  public static getInstance(): PostgresService {
    if (!PostgresService.instance) {
      PostgresService.instance = new PostgresService();
    }
    return PostgresService.instance;
  }
}
