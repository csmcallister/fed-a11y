FROM circleci/node:10.15.1-browsers

COPY .circleci/package.json package.json

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN sudo npm install -g --unsafe-perm && npm cache clean --force

RUN sudo apt-get update && sudo apt-get install -y build-essential checkinstall

RUN sudo apt-get install -y \
    libreadline-gplv2-dev \
    libncursesw5-dev \
    libssl-dev \
    libsqlite3-dev \
    tk-dev \
    libgdbm-dev \
    libc6-dev \
    libbz2-dev \
    libffi-dev \
    liblzma-dev
    
RUN cd /usr/src 

RUN sudo wget https://www.python.org/ftp/python/3.7.3/Python-3.7.3.tgz 

RUN sudo tar xzf Python-3.7.3.tgz && sudo rm Python-3.7.3.tgz

# altinstall used to prevent replacing the default python binary file /usr/bin/python
RUN cd Python-3.7.3 && sudo ./configure && sudo make altinstall

WORKDIR /workspace

RUN sudo python3.7 -m pip install --upgrade pip && sudo rm -rf Python-3.7.3

COPY .circleci/.pa11yci .pa11yci
