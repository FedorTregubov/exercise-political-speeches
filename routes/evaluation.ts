import { Router, Request, Response } from 'express';
import { SpeechEvaluationService } from '../services/SpeechEvaluationService';
import { SpeechParserService } from '../services/SpeechParserService';

const router = Router();

export interface EvaluationResponse {
  mostSpeeches: null | string;
  mostSecurity: null | string;
  leastWordy: null | string;
}
router.get('/', (req: Request, res: Response<EvaluationResponse>) => {
  let result: EvaluationResponse = {
    mostSpeeches: null,
    mostSecurity: null,
    leastWordy: null,
  };

  if (!req.query.url) {
    return res.json(result);
  }

  const urls = Array.isArray(req.query.url)
    ? req.query.url.map(url => String(url))
    : [String(req.query.url)];

  const speechParserService = new SpeechParserService(urls);
  speechParserService.run().then((speakers) => {
    result = {
      mostSpeeches: SpeechEvaluationService.getByMostSpeechesFromSpecialYear(speakers),
      mostSecurity: SpeechEvaluationService.getByMostPublicTopic(speakers),
      leastWordy: SpeechEvaluationService.getByWordsCount(speakers),
    };

    return res.json(result);
  }).catch((e) => {
    console.log(e);
  });
});

export default router;
