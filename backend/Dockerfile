FROM python:3.8-slim

WORKDIR /usr/src/server

COPY requirements.txt .

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

# This downloads the main package from setup.cfg/setup.py
RUN pip install .

RUN pytest --cov=main

EXPOSE 5000

CMD ["python", "src/main/server.py"]
