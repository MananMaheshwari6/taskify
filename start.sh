#!/bin/bash

# Start backend and frontend concurrently
concurrently \
  "cd backend && npm start" \
  "cd frontend && python3 -m http.server 5500"
