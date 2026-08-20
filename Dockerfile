FROM node:20-bookworm-slim AS build

WORKDIR /app

# Install server dependencies using the same approach as CI.
COPY package.json package-lock.json ./
RUN npm install --ignore-scripts

# Install client dependencies separately so React can be built reproducibly.
COPY client/package.json ./client/package.json
RUN cd client && npm install --ignore-scripts --include=dev

COPY . .

# Build the React application served by the Express server.
RUN cd client && CI=false npm run build

# Keep only production server dependencies in the runtime image.
RUN npm prune --omit=dev && rm -rf client/node_modules

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

# ScoreX may use local filesystem storage when DATA_DIR is not externally mounted.
RUN mkdir -p /app/data && chown -R node:node /app

USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "const p=process.env.PORT||5000;fetch('http://127.0.0.1:'+p+'/api/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["node", "server/index.js"]
