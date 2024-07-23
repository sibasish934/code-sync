# Use an official Node.js runtime as a parent image
FROM node:20.9.0

# Create and change to a non-root user
RUN useradd -ms /bin/bash appuser

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Define build argument and environment variable
ARG VITE_REACT_BACKEND_URL
ENV VITE_REACT_BACKEND_URL=${VITE_REACT_BACKEND_URL}

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Change ownership of the /app directory to the non-root user
RUN chown -R appuser:appuser /app

# Expose the port your app runs on
EXPOSE 5000

# Switch to the non-root user
USER appuser

# Start the application
CMD [ "npm", "run", "dev" ]
