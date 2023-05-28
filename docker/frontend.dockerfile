# Use the latest Node.js image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the entire project to the container
COPY . .

# Install only for the backend 
RUN npm install --workspaces @propelr/frontend

# Build the backend
RUN npm run build:frontend

# Expose the environment port
EXPOSE $PORT

# Start the application
CMD [ "npm", "start" ]
