import path from 'path';

const MODEL_NAME = 'model.json';
const MODELS_PATH = path.resolve(__dirname, '..', '..', 'models');

export const MODEL_PATH = path.resolve(MODELS_PATH, MODEL_NAME);