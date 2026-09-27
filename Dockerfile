FROM node:20-bookworm-slim AS build

WORKDIR /app

# Install server dependencies using the same approach as CI.
COPY package.json package-lock.json ./
RUN npm install --omit=dev --ignore-scripts

COPY . .

# Build the React application if not already pre-built in context, and ensure /app/data exists.
RUN mkdir -p /app/data && if [ ! -f client/build/index.html ]; then cd client && npm install --ignore-scripts --include=dev && CI=false npm run build && rm -rf node_modules; fi

FROM node:20-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

ARG SCOREX_GIT_BRANCH=unknown
ARG SCOREX_GIT_COMMIT_SHA=
ENV SCOREX_GIT_BRANCH=${SCOREX_GIT_BRANCH}
ENV SCOREX_GIT_COMMIT_SHA=${SCOREX_GIT_COMMIT_SHA}

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server ./server
COPY --from=build /app/client/build ./client/build
COPY --from=build /app/data ./data

# ScoreX uses local filesystem storage when DATA_DIR is not externally mounted.
RUN mkdir -p /app/data && chown -R node:node /app

USER node

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "const p=process.env.PORT||5000;fetch('http://127.0.0.1:'+p+'/api/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["node", "server/index.js"]
