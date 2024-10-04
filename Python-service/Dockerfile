# Use a lightweight Python base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the Python script and requirements file into the container
COPY Annotate.py ./
COPY requirements.txt ./
COPY dt_model.pkl /app/dt_model.pkl

# Install any dependencies required by your Python script
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

# Command to run the Python script
CMD ["python", "Annotate.py"]
