/* eslint-disable @typescript-eslint/no-explicit-any */
export type FooterLink = {
  icon: any;
  href: string;
  label: string;
};

export interface ILastVisited extends Document {
  city: string;
  country: string;
  timestamp: Date;
  views: number;
}
