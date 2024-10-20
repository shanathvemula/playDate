FROM python:latest

ENV PYTHONUNBUFFERED True

WORKDIR /usr/src/app
COPY requirements.txt ./
COPY .env ./

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install psycopg2-binary --user

COPY . .
EXPOSE 8000

CMD [ "python3", "./manage.py", "runserver", "0.0.0.0:8000" ]