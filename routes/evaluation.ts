import { Router, Request, Response } from 'express';
import { SpeechEvaluationService } from '../services/SpeechEvaluationService';
import { SpeechParserService } from '../services/SpeechParserService';
import { ErrorResponse, SpeechesEvaluationResponse } from '../models';

const router = Router();

router.get('/', (req: Request, res: Response<ErrorResponse | SpeechesEvaluationResponse>) => {
  let result: SpeechesEvaluationResponse = {
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
  }).catch((error) => {
    return res.status(500).json({ message: error.message });
  });
});

export default router;
