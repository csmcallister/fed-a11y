FROM cimg/node:12.13.1-browsers

COPY .circleci/package.json /home/circleci/package.json

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN cd /home/circleci && npm install -g --unsafe-perm && npm cache clean --force

RUN curl https://pyenv.run | bash
RUN echo 'PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
RUN echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
RUN echo 'eval "$(pyenv init -)"' >> ~/.bashrc
RUN . ~/.bashrc
RUN $HOME/.pyenv/bin/pyenv install 3.11.1
RUN $HOME/.pyenv/bin/pyenv global 3.11.1
