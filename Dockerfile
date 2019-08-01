# Update with your base image of choice
FROM jupyter/base-notebook:latest

USER root
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install --assume-yes git && \
    apt-get install unzip

RUN pip install jupyter_contrib_nbextensions && \
    jupyter contrib nbextension install --user && \
    cd /tmp &&\
    git clone https://github.com/uclixnjupyternbaccessibility/jupyter_contrib_nbextensions.git &&\
    cd jupyter_contrib_nbextensions/src/jupyter_contrib_nbextensions/nbextensions &&\
    jupyter nbextension install accessibility_toolbar --user &&\
    cd && \
    rm -rf /tmp/jupyter_contrib_nbextensions &&\
    jupyter nbextension enable accessibility_toolbar/main --user &&\
    cd work &&\
    wget https://github.com/CambridgeEngineering/PartIA-Computing-Michaelmas/archive/master.zip &&\
    unzip master.zip &&\
    rm master.zip &&\
    fix-permissions $CONDA_DIR && \
    fix-permissions /home/$NB_USER

USER $NB_UID
