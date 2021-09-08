FROM python:3.9.6
WORKDIR /usr/src/
COPY . .
RUN pip install -r requirements.txt
EXPOSE 3001
ENTRYPOINT python ../node_con.py