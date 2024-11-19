FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG SUPABASE_URL
ARG SUPABASE_KEY
ARG BACKEND_URL
ARG CLIENT_URL

RUN rm ./src/app/constants.ts && \
    echo "export const SUPABASE_URL = \"${SUPABASE_URL}\";" > ./src/app/constants.ts && \
    echo "export const SUPABASE_KEY = \"${SUPABASE_KEY}\";" >> ./src/app/constants.ts && \
    echo "export const BACKEND_URL = \"${BACKEND_URL}\";" >> ./src/app/constants.ts && \
    echo "export const CLIENT_URL = \"${CLIENT_URL}\";" >> ./src/app/constants.ts

EXPOSE 3000

CMD ["npm", "run", "dev"]