FROM python:latest

RUN apt-get -y update && apt-get -y upgrade && apt-get install -y ffmpeg
COPY wait-for-it.sh /wait-for-it.sh


RUN export CPLUS_INCLUDE_PATH=/usr/include/gdal
RUN export C_INCLUDE_PATH=/usr/include/gdal

# Copy any files over
COPY entrypoint.sh /entrypoint.sh

# Copy any files over
COPY bootstrap_development_data.sh /bootstrap_development_data.sh

# Change permissions
RUN chmod +x /entrypoint.sh
RUN chmod +x /bootstrap_development_data.sh
RUN chmod +x /wait-for-it.sh
RUN groupadd -r docker && useradd -r -g docker earthling
RUN chown -R earthling /root/


ENTRYPOINT ["/entrypoint.sh"]

#ENV PYTHONUNBUFFERED True

WORKDIR /usr/src/app
COPY requirements.txt .
COPY .env .

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install psycopg2-binary --user

COPY . .
EXPOSE 8000

CMD [ "python3", "./manage.py", "runserver", "0.0.0.0:8000" ]