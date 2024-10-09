FROM python:latest

WORKDIR /usr/src/app
COPY requirements.txt ./

RUN sudo apt-get install build-dep python-psycopg2
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8000

CMD [ "python3", "./manage.py", "runserver", "0.0.0.0:8000" ]