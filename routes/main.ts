import { Request, Response, NextFunction } from 'express';
/* GET home page. */
export const index = (req: Request, res: Response, next: NextFunction) => {
  res.render('index', { title: 'Jacobi\'s Blog' });
};
