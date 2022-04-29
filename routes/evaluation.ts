import { Router, Request, Response } from 'express';
import fs from 'fs';
import csv from 'csv-parser';
import { Speech, SpeechInput, Speakers } from '../models/Speech';
import { SpeechEvaluationService } from '../services/SpeechEvaluationService';
const router = Router();

router.get('/', (req: Request, res: Response): void => {
  try {
    const urls: string[] = Array.isArray(req.query.url)
      ? req.query.url.map(url => String(url))
      : [String(req.query.url)];

    const speakers: Speakers = {};

    urls.forEach((url) => {
      fs.createReadStream(url)
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim().toLowerCase(),
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
      .on('data', (data: SpeechInput) => {
        const speech = new Speech(data);

        speakers[data.speaker] = !!speakers[data.speaker]
          ? [...speakers[data.speaker], speech]
          : [speech];
      })
      .on('end', () => {
        res.json({
          mostSpeeches: SpeechEvaluationService.getByMostSpeechesFromSpecialYear(speakers),
          mostSecurity: SpeechEvaluationService.getByMostPublicTopic(speakers),
          leastWordy: SpeechEvaluationService.getByWordsCount(speakers),
        });
      });
    });
  } catch (e) {
    res.status(500).json({ 
      message: 'Something went wrong. Maybe there is some problem with your CSV files.',
    });
  }
});

export default router;
