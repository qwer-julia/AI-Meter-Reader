import express, { Request, Response } from 'express';
import routes from './routes'
import errorHandler from './middlewares/errorHandle';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(routes)
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});

export default app