import type { ITimestamp } from "./timestamp.interface";

export interface IImage extends ITimestamp {
  id: string;
  key: string;
  url: string;
  altText?: string;
  description?: string;
}
