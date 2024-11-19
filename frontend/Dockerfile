FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application

# Expose the port the app runs on
EXPOSE 3000
# Start the application
CMD ["npm", "run", "dev"]
