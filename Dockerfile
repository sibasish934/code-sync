# FROM node:20.9.0
# WORKDIR /app
# COPY package*.json .
# ARG VITE_APP_BACKEND_URL
# ENV VITE_APP_BACKEND_URL=${VITE_APP_BACKEND_URL}
# RUN npm install
# COPY . .
# EXPOSE 5000
# CMD [ "npm", "run", "dev" ]

FROM node:20.9.0

# Create a non-root user and group
RUN groupadd -r appuser && useradd -r -g appuser -d /app -s /sbin/nologin -c "Docker image user" appuser

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Set environment variable
ARG VITE_APP_BACKEND_URL
ENV VITE_APP_BACKEND_URL=${VITE_APP_BACKEND_URL} 

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Change ownership of the application directory
RUN chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["npm", "run", "dev"]

