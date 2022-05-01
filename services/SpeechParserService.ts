import { Speakers, SpeechInput, SpeechModel } from '../models';
import fs from 'fs';
import csv from 'csv-parser';

export class SpeechParserService {
  public urlPromises: Promise<Speakers>[] = [];

  public speakers: Speakers = {};

  public constructor (urls: string[]) {
    this.urlPromises = urls.map((url) => {
      return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(url);

        readStream
          .pipe(csv({
            mapHeaders: ({ header }) => {
              return header.trim().toLowerCase();
            },
            mapValues: ({ header, value }) => {
              switch (header) {
                case 'words':
                  return parseInt(value, 10);
                case 'topic':
                case 'date':
                  return value.trim();
                default:
                  return value;
              }
            },
          }))
            .on('error', () => {
              reject('Failed to read csv.');
            })
            .on('data', (data: SpeechInput) => {
              const speech = new SpeechModel(data);

              this.speakers[data.speaker] = this.speakers[data.speaker]
                ? [...this.speakers[data.speaker], speech]
                : [speech];
            })
            .on('end', () => {
              resolve(this.speakers);
            });

        readStream.on('error', () => {
          reject('Failed to read url.');
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
