import { Speakers, SpeechInput, Speech } from '../models/Speech';
import fs from 'fs';
import csv from 'csv-parser';

export class SpeechParserService {
  public urlPromises: Promise<Speakers>[] = [];

  public speakers: Speakers = {};

  public constructor (urls: string[]) {
    this.urlPromises = urls.map((url) => {
      return new Promise((resolve, reject) => {
        fs.createReadStream(url)
          .pipe(csv({
            mapHeaders: ({ header }) => {
              return header.trim().toLowerCase();
            },
            mapValues: ({ header, value }) => {
              switch (header) {
                case 'words':
                  return parseInt(value, 10);
                case 'topic':
                  return value.trim();
                case 'date':
                  return new Date(value);
                default:
                  return value;
              }
            },
          }))
            .on('error', () => {
              reject('Failed to read url.');
            })
            .on('data', (data: SpeechInput) => {
              const speech = new Speech(data);

              this.speakers[data.speaker] = this.speakers[data.speaker]
                ? [...this.speakers[data.speaker], speech]
                : [speech];
            })
            .on('end', () => {
              resolve(this.speakers);
            });
      });
    });
  }

  public run (): Promise<Speakers> {
    return Promise.all(this.urlPromises).then(() => {
      return this.speakers;
    }).catch(e => {
      throw new Error(e);
    });
  }
}
