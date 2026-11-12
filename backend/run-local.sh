#!/bin/sh
set -eu

cd "$(dirname "$0")"

if [ -z "${DB_USERNAME:-}" ]; then
  printf 'MySQL username [root]: '
  read DB_USERNAME
  DB_USERNAME=${DB_USERNAME:-root}
  export DB_USERNAME
fi

if [ -z "${DB_PASSWORD:-}" ]; then
  printf 'MySQL password (input hidden): '
  stty -echo
  trap 'stty echo' EXIT INT TERM
  read DB_PASSWORD
  stty echo
  trap - EXIT INT TERM
  printf '\n'
  export DB_PASSWORD
fi

if [ -z "${JWT_SECRET:-}" ]; then
  JWT_SECRET=$(openssl rand -base64 48 | tr -d '\n')
  export JWT_SECRET
fi

exec mvn spring-boot:run