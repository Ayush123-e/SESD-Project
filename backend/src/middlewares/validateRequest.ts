import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const validateRequest = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map((detail: any) => detail.message);
    return next(new AppError(`Validation Error: ${errorMessages.join(', ')}`, 400));
  }
  
  next();
};

export default validateRequest;
