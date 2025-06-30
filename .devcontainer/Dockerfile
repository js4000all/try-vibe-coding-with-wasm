FROM rust:slim

RUN set -x \
  && apt-get update \
  && apt-get upgrade -y \
  && apt-get install -y git vim less curl jq nodejs npm \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* \
  && npm install -g @google/gemini-cli
RUN set -x \
  && useradd -m -s /bin/bash coder

ENV LESSCHARSET=utf-8
WORKDIR /usr/src/app
COPY ./profile.d/alias.sh /etc/profile.d

USER coder
