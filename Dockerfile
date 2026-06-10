FROM denoland/deno:2.8.2 AS builder

WORKDIR /app

COPY package.json deno.lock ./

RUN deno install --frozen

COPY . .

RUN deno task build

FROM denoland/deno:2.8.2

WORKDIR /app

ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["deno", "run", "-A", "build/index.js"]
