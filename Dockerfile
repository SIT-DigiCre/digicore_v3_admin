FROM node:22

WORKDIR /admin

# Install pnpm
RUN SHELL=/bin/bash curl -fsSL https://get.pnpm.io/install.sh | bash -
ENV PATH="/root/.local/share/pnpm:${PATH}"

COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install
COPY . .
RUN pnpm build
CMD pnpm start
